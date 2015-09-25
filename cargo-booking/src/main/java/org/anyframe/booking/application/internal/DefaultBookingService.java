package org.anyframe.booking.application.internal;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.anyframe.booking.application.BookingService;
import org.anyframe.booking.domain.model.booking.Booking;
import org.anyframe.booking.domain.model.booking.BookingId;
import org.anyframe.booking.domain.model.booking.BookingRepository;
import org.anyframe.booking.domain.model.booking.BookingStatus;
import org.anyframe.booking.domain.model.location.Location;
import org.anyframe.booking.domain.model.location.LocationRepository;
import org.anyframe.booking.domain.model.location.UnLocode;
import org.anyframe.booking.infrastructure.tracking.CargoTrackerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DefaultBookingService implements BookingService {

	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private LocationRepository locationRepository;

	@Autowired
	private CargoTrackerService cargoTrackerService;
	
	private static final Logger logger = LoggerFactory.getLogger(
			 DefaultBookingService.class);
	 
	@Override
	public Booking registerBooking(Map<String, String> bookingInformation, BookingStatus bookingStatus) {
		BookingId bookingId = bookingRepository.nextBookingId();
		
		String trackingId = "";
		Date arrivalDeadline = null;
		
		Location origin = locationRepository.find(new UnLocode(bookingInformation.get("originUnlocode")));
		Location destination = locationRepository.find(new UnLocode(bookingInformation.get("destinationUnlocode")));
		try {
			arrivalDeadline = new SimpleDateFormat("yyyy-MM-dd")
					.parse(bookingInformation.get("arrivalDeadline"));
		} catch (ParseException e) {
			e.printStackTrace();
		}

		Booking booking = new Booking(bookingId,
				trackingId,
				origin,
				destination,
				arrivalDeadline,
				bookingInformation.get("userId"),
				bookingInformation.get("commodity"),
				Integer.parseInt(bookingInformation.get("quantity")),
				bookingStatus);
		bookingRepository.store(booking);

        logger.debug("Registered new booking with booking id {}",
                booking.getBookingId().getIdString());
        
		return booking;
	}

	@Override
	public void acceptBooking(BookingId bookingId) {
		Booking booking = bookingRepository.findByBookingId(bookingId);
		
		String trackingId = "";
		
		Map<String, String> cargoBookingParameters = new HashMap<String, String>();
		
		cargoBookingParameters.put("originUnlocode", booking.getOrigin().getUnLocode().getIdString());
		cargoBookingParameters.put("destinationUnlocode", booking.getDestination().getUnLocode().getIdString());
		cargoBookingParameters.put("arrivalDeadline", booking.getArrivalDeadline().toString());
		
		trackingId = cargoTrackerService.registerCargo(cargoBookingParameters);
		logger.debug("CargoTracker booked new cargo, it's tracking id {}", trackingId);
		
		booking.setTrackingId(trackingId);
		booking.setBookingStatus(BookingStatus.ACCEPTED);
		
		bookingRepository.store(booking);
		
	}

	@Override
	public String changeDestination(BookingId bookingId,
			String destination) {
		Booking booking = bookingRepository.findByBookingId(bookingId);
		
		Location newDestination = new Location();
		newDestination = locationRepository.find(new UnLocode(destination));
		booking.setDestination(newDestination);
		bookingRepository.store(booking);
		
		return booking.getBookingId().getIdString();
	}

}
