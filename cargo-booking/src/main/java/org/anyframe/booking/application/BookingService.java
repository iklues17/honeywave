package org.anyframe.booking.application;

import java.util.Map;

import org.anyframe.booking.domain.model.booking.Booking;
import org.anyframe.booking.domain.model.booking.BookingId;
import org.anyframe.booking.domain.model.booking.BookingStatus;

public interface BookingService {

	Booking registerBooking(Map<String, String> bookingInformation, BookingStatus bookingStatus);
	
	void acceptBooking(BookingId bookingId);

	String changeDestination(BookingId bookingId, String destination);
}
