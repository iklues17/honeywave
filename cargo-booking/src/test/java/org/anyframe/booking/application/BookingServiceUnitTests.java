package org.anyframe.booking.application;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import org.anyframe.CargoBookingApplication;
import org.anyframe.booking.domain.model.booking.Booking;
import org.anyframe.booking.domain.model.booking.BookingId;
import org.anyframe.booking.domain.model.booking.BookingRepository;
import org.anyframe.booking.domain.model.booking.BookingStatus;
import org.anyframe.booking.domain.model.location.Location;
import org.anyframe.booking.domain.model.location.LocationRepository;
import org.anyframe.booking.domain.model.location.UnLocode;
import org.anyframe.booking.infrastructure.tracking.CargoTrackerService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes=CargoBookingApplication.class)
@WebAppConfiguration
public class BookingServiceUnitTests {
	
	@Mock
	private BookingRepository mockBookingRepository;
	
	@Mock
	private LocationRepository mockLocationRepository;
	
	@Mock
	private CargoTrackerService mockCargoTrackerService;
	
	@InjectMocks
	@Autowired
	private BookingService bookingService;
	
	private Map<String, String> bookingInformation;
	
	private BookingId bookingId;
	
	private Booking booking;
	
	private BookingStatus bookingStatus;
	
	@Value("JNTKO") 
	private String newDestination;
	
	@Before
	public void setUp() throws Exception {
		// Mock setting
		MockitoAnnotations.initMocks(this);

		// bookingInformation setting 
		this.bookingInformation = new HashMap<String, String>();
		
		this.bookingInformation.put("userId", "test");
		this.bookingInformation.put("originUnlocode", "USCHI");
		this.bookingInformation.put("destinationUnlocode", "NLRTM");
		this.bookingInformation.put("arrivalDeadline", "2016-12-31");
		this.bookingInformation.put("commodity", "Material");
		this.bookingInformation.put("quantity", "1");
		
		this.bookingStatus = BookingStatus.NOT_ACCEPTED;
		
		this.bookingId = new BookingId("BOOKING123");
		this.booking = new Booking(bookingId, "", 
				new Location(new UnLocode("USCHI"), "Chicago"),
				new Location(new UnLocode("JNTKO"), "Tokyo"),
				new SimpleDateFormat("yyyy-mm-dd").parse("2016-12-30"),
				"",
				"",
				1,
				this.bookingStatus);
	}

	/**
	 * Test1 registerBookingTest
	 * input
	 * 	- bookingInformation
	 * 	- bookingStatus
	 */
	@Test
	@Transactional
	public void registerBookingTest()  {
		// Setting
		when(mockBookingRepository.nextBookingId()).thenReturn(new BookingId("BOOKING123"));
		when(mockLocationRepository.find(new UnLocode("USCHI"))).thenReturn(new Location(new UnLocode("USCHI"), "Chicage"));
		when(mockLocationRepository.find(new UnLocode("NLRTM"))).thenReturn(new Location(new UnLocode("NLRTM"), "Rotterdam"));
		
		// Test method(registerBooking) Execution
		bookingService.registerBooking(bookingInformation, bookingStatus);
		
		// Result check
		verify(mockBookingRepository).nextBookingId();
		verify(mockLocationRepository).find(new UnLocode("USCHI"));
		verify(mockLocationRepository).find(new UnLocode("NLRTM"));
		
	}
	
	/**
	 * Test2 changeDestinationTest
	 * input 
	 * 	- newDestination
	 */
	@Test
	@Transactional
	public void chageDestinationTest() {
		// Setting
		when(mockBookingRepository.findByBookingId(this.bookingId)).thenReturn(this.booking);
		when(mockLocationRepository.find(new UnLocode(this.newDestination))).thenReturn(new Location(new UnLocode(this.newDestination), "Tokyo"));
		
		// Test method(changeDestination) Execution
		String resultBookingId = bookingService.changeDestination(this.bookingId, this.newDestination);
		
		// Result check
		assertEquals("ChangeDestination return bookingId", resultBookingId, this.bookingId.getIdString());
		verify(mockBookingRepository).findByBookingId(this.bookingId);
		verify(mockLocationRepository).find(new UnLocode(this.newDestination));
		
	}
	
	/**
	 * Test3 acceptBookingTest
	 */
	@Test
	@Transactional
	public void acceptBookingTest() {		
		// Setting
		when(mockBookingRepository.findByBookingId(this.bookingId)).thenReturn(this.booking);
		when(mockCargoTrackerService.registerCargo((Map<String, String>) any())).thenReturn("TESTID");
		
		// Test method(acceptBooking) Execution
		bookingService.acceptBooking(bookingId);
				
		// Result check
		verify(mockBookingRepository).findByBookingId(bookingId);
		verify(mockCargoTrackerService).registerCargo((Map<String, String>) any());
		
	}
}
