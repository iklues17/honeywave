package org.anyframe.booking.interfaces.booking.facade;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyZeroInteractions;
import static org.mockito.Mockito.when;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.anyframe.CargoBookingApplication;
import org.anyframe.booking.application.BookingService;
import org.anyframe.booking.domain.model.booking.Booking;
import org.anyframe.booking.domain.model.booking.BookingId;
import org.anyframe.booking.domain.model.booking.BookingRepository;
import org.anyframe.booking.domain.model.booking.BookingStatus;
import org.anyframe.booking.domain.model.location.Location;
import org.anyframe.booking.domain.model.location.LocationRepository;
import org.anyframe.booking.domain.model.location.UnLocode;
import org.anyframe.booking.infrastructure.tracking.CargoRoute;
import org.anyframe.booking.infrastructure.tracking.CargoTrackerService;
import org.anyframe.booking.interfaces.booking.facade.dto.BookingDetailDto;
import org.anyframe.booking.interfaces.booking.facade.dto.BookingDto;
import org.anyframe.booking.util.TestUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = CargoBookingApplication.class)
@WebAppConfiguration
public class BookingServiceFacadeUnitTests {

	@Mock
	private BookingRepository mockBookingRepository;
	
	@Mock
	private LocationRepository mockLocationRepository;
	
	@Mock
	private CargoTrackerService mockCargoTrackerService;
	
	@Mock
	private BookingService mockBookingService;
	
	@InjectMocks
	@Autowired
	private BookingServiceFacade bookingServiceFacade;
	
	private List<Booking> bookings;
	
	private Booking booking;
	
	private BookingId bookingId;
	
	private Map<String, String> bookingInformation;
	
	private BookingStatus bookingStatus;
	
	@Before
	public void setUp() throws Exception {
		// Mock setting
		MockitoAnnotations.initMocks(this);

		ReflectionTestUtils.setField(TestUtils.unwrapProxy(bookingServiceFacade), "bookingRepository", mockBookingRepository);
		ReflectionTestUtils.setField(TestUtils.unwrapProxy(bookingServiceFacade), "locationRepository", mockLocationRepository);
		ReflectionTestUtils.setField(TestUtils.unwrapProxy(bookingServiceFacade), "cargoTrackerService", mockCargoTrackerService);
		ReflectionTestUtils.setField(TestUtils.unwrapProxy(bookingServiceFacade), "bookingService", mockBookingService);

		// bookingInformation setting 
		this.bookingInformation = new HashMap<String, String>();
		
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
		this.bookings = new ArrayList<Booking>();
		bookings.add(booking);
	}
	
	/**
	 * Test1 listUserBookingsTest
	 * input
	 * 	- userId
	 */
	@Test
	public void listUserBookingsTest() {
		// Setting
		String userId = "TESTID";
		when(mockBookingRepository.findByUserId(userId)).thenReturn(this.bookings);

		// Test method(listUserBookings) Execution
		List<BookingDto> resultBookings = bookingServiceFacade.listUserBookings(userId);

		// Result check
		verify(mockBookingRepository).findByUserId(userId);
		assertNotNull("listUserBookings should return BookingDto List", resultBookings);
		
	}
	
	/**
	 * Test2 getBookingDetailTest
	 * input 
	 * 	- bookingId
	 */
	@Test
	public void getBookingDetailTest() {
		// Setting
		when(mockBookingRepository.findByBookingId(this.bookingId)).thenReturn(this.booking);
		when(mockCargoTrackerService.getCargo(this.bookingId.getIdString())).thenReturn(new CargoRoute());

		// Test method(getBookingDetail) Execution
		BookingDetailDto resultBookingDetailDto = bookingServiceFacade.getBookingDetail(this.bookingId.getIdString());

		// Result check
		verify(mockBookingRepository).findByBookingId(this.bookingId);
		verifyZeroInteractions(mockCargoTrackerService);
		assertNotNull("getBookingDetail should return BookingDetailDto", resultBookingDetailDto);
	}
	
	/**
	 * Test3 listNotAcceptedBookingsTest
	 * input
	 * 	- bookingStatus
	 */
	@Test
	public void listNotAcceptedBookingsTest() {
		// Setting
		when(mockBookingRepository.findByBookingStatus(this.bookingStatus)).thenReturn(this.bookings);

		// Test method(listNotAcceptedBookings) Execution
		List<BookingDto> resultBookings = bookingServiceFacade.listNotAcceptedBookings();

		// Result check
		verify(mockBookingRepository).findByBookingStatus(this.bookingStatus);
		assertNotNull("listNotAcceptedBookings should return BookingDto List", resultBookings);
	}
	
	/**
	 * Test4 registerBookingTest
	 * input 
	 * 	- bookingInformation
	 */
	@Test
	public void registerBookingTest() {
		// Setting
		when(mockBookingService.registerBooking((Map<String, String>) any(), (BookingStatus) any())).thenReturn(this.booking);

		// Test method(registerBooking) Execution
		String resultBookingId = bookingServiceFacade.registerBooking(this.bookingInformation);

		// Result check
		verify(mockBookingService).registerBooking((Map<String, String>) any(), (BookingStatus) any());
		assertEquals("Return bookingId would be BOOKING123", this.bookingId.getIdString(), resultBookingId);
	}
	
	/**
	 * Test5 registerAcceptedBookingTest
	 *  - bookingInformation
	 */
	@Test
	public void registerAcceptedBookingTest() {
		// Setting
		when(mockBookingService.registerBooking((Map<String, String>) any(), (BookingStatus) any())).thenReturn(this.booking);

		// Test method(registerAcceptedBooking) Execution
		Booking resultBooking = bookingServiceFacade.registerAcceptedBooking(this.bookingInformation);

		// Result check
		verify(mockBookingService).registerBooking((Map<String, String>) any(), (BookingStatus) any());
		assertNotNull("registerAcceptedBooking should return booking", resultBooking);
	
	}
	
	/**
	 * Test6 acceptBookingTest
	 * 	- bookingId
	 */
	@Test
	public void acceptBookingTest() {
		// Test method(acceptBooking) Execution
		bookingServiceFacade.acceptBooking(this.bookingId.getIdString());

		// Result check
		verify(mockBookingService).acceptBooking(this.bookingId);
	}
	
	/**
	 * Test7 changeDestinationTest
	 *  - bookingId
	 *  - destinationUnLocode
	 */
	@Test
	public void changeDestinationTest() {
		// Test method(changeDestination) Execution
		bookingServiceFacade.changeDestination(this.bookingId.getIdString(), "JNTKO");
		
		// Result check
		verify(mockBookingService).changeDestination(this.bookingId, "JNTKO");
	}
}
