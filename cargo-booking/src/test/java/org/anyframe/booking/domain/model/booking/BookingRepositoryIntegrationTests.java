package org.anyframe.booking.domain.model.booking;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.text.SimpleDateFormat;
import java.util.List;

import org.anyframe.CargoBookingApplication;
import org.anyframe.booking.domain.model.booking.Booking;
import org.anyframe.booking.domain.model.booking.BookingId;
import org.anyframe.booking.domain.model.booking.BookingRepository;
import org.anyframe.booking.domain.model.booking.BookingStatus;
import org.anyframe.booking.domain.model.location.Location;
import org.anyframe.booking.domain.model.location.LocationRepository;
import org.anyframe.booking.domain.model.location.UnLocode;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes=CargoBookingApplication.class)
@WebAppConfiguration
public class BookingRepositoryIntegrationTests {

	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private LocationRepository locationRepository;
	
	private Booking booking, newBooking;
	
	private BookingId bookingId, newBookingId;
	
	private BookingStatus bookingStatus;
	
	private Location origin, destination;
	
	@Value("test")
	private String userId;
	
	@Before
	public void setUp() throws Exception {
		origin = locationRepository.find(new UnLocode("USCHI"));
		destination = locationRepository.find(new UnLocode("JNTKO"));
		
		booking = new Booking(
					new BookingId("ABC123"),	
					"", 		
					origin,		
					destination,	
					new SimpleDateFormat("yyyy-mm-dd").parse("2016-12-31"),
					userId,
					"Material",
					1,
					BookingStatus.NOT_ACCEPTED);
		
		bookingRepository.store(booking);
		bookingId = booking.getBookingId();
		bookingStatus = BookingStatus.NOT_ACCEPTED;
	}
	
	/**
	 * Test1 findByBookingIdTest
	 * input : bookingId
	 */
	@Test
	@Transactional
	public void findByBookingIdTest() {
		// Test method(findByBookingId) Execution
		Booking resultBooking = bookingRepository.findByBookingId(bookingId);
		
		// Result check
		assertEquals("Found booking would be stored booking", booking, resultBooking);
	}
	
	/**
	 * Test2 findByUserIdTest
	 * input : userId
	 */
	@Test
	@Transactional
	public void findByUserIdTest() {
		// Test method(findByUserId) Execution
		List<Booking> foundBookingList = bookingRepository.findByUserId(userId);
		
		// Result check
		Booking resultBooking = foundBookingList.get(0);
		assertEquals("Found booking would be stored booking", booking, resultBooking);
	}
	
	/**
	 * Test3 streTest
	 * input : newBooking
	 */
	@Test
	@Transactional
	public void storeTest() throws Exception{
		// setup for store
		newBookingId = new BookingId("ABCD1234");
		newBooking = new Booking(
						newBookingId,	
						"", 		
						origin,		
						destination,	
						new SimpleDateFormat("yyyy-mm-dd").parse("2016-12-31"),
						userId,
						"Material",
						1,
						BookingStatus.NOT_ACCEPTED); 
		
		// Test method(store) Execution
		bookingRepository.store(newBooking);
		
		// Result check
		Booking resultBooking = bookingRepository.findByBookingId(newBookingId);
		
		assertEquals("Store result would be newBooking", newBooking, resultBooking);
	}
	
	/**
	 * Test4 nextBookingIdTest
	 */
	@Test
	@Transactional
	public void nextBookingIdTest() {
		// Test method(nextBookingId) Execution
		BookingId generatedBookingId = bookingRepository.nextBookingId();
		
		// Result check
		assertNotNull("Generated BookingId would be not null", generatedBookingId);
	}
	
	/**
	 * Test5 findByBookingStatusTest
	 * input : bookingStatus
	 */
	@Test
	@Transactional
	public void findByBookingStatusTest() {
		// Test method(findByBookingStatus) Execution
		List<Booking> resultBookingList = bookingRepository.findByBookingStatus(bookingStatus);
		
		// Result check
		assertTrue("FindByBookingStatus would be more than one booking", resultBookingList.size()>0);
	}
}
