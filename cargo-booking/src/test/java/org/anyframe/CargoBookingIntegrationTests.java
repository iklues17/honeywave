package org.anyframe;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.anyframe.booking.application.BookingService;
import org.anyframe.booking.domain.model.booking.BookingStatus;
import org.anyframe.booking.infrastructure.tracking.CargoRoute;
import org.anyframe.booking.infrastructure.tracking.CargoTrackerService;
import org.anyframe.booking.interfaces.booking.facade.BookingServiceFacade;
import org.anyframe.booking.util.TestUtils;
import org.json.simple.parser.JSONParser;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = CargoBookingApplication.class)
@WebAppConfiguration
public class CargoBookingIntegrationTests {

	@Mock
	private CargoTrackerService mockCargoTrackerService;
	
	@InjectMocks
	@Autowired
	private BookingService bookingService;
	
	@InjectMocks
	@Autowired
	private BookingServiceFacade bookingServiceFacade;
	
	@Autowired
	private WebApplicationContext context;
	
	private MockMvc mvc;

	@Value("TESTUSER")
	private String userId;
	
	private String bookingId;
	
	@Value("TESTTRID")
	private String trackingId;
	
	@Before
	public void setUp() throws Exception{
		// Mock setting
		MockitoAnnotations.initMocks(this);
		this.mvc = MockMvcBuilders.webAppContextSetup(this.context).build();

		ReflectionTestUtils.setField(TestUtils.unwrapProxy(bookingServiceFacade), "cargoTrackerService", mockCargoTrackerService);
	}
	
	@Test
	@Transactional
	public void cargoBookingIntegrationTests() throws Exception {
		JSONParser par = new JSONParser();
		
		// Set the newBooking for registerBooking
		Map<String, String> newBooking = new HashMap<String, String>();
		newBooking.put("userId", this.userId);
		newBooking.put("originUnlocode", "USCHI");
		newBooking.put("destinationUnlocode", "JNTKO");
		newBooking.put("arrivalDeadline", "2016-12-30");
		newBooking.put("commodity", "TestBox");
		newBooking.put("quantity", "1");
		
		// Set the destination for changeDestination
		Map<String, String> destination = new HashMap<String, String>();
		destination.put("destinationUnlocode", "CNHKG");
		
		CargoRoute cargoRoute = new CargoRoute(this.trackingId, "Chicago (USCHI)","Hong Kong (CNHKG)",
				new Date(), false, false, "", "NOT_ROUTED");
		// Set the mockCargoTrackerService
		when(mockCargoTrackerService.registerCargo((Map<String, String>) any())).thenReturn(this.trackingId);
		when(mockCargoTrackerService.getCargo(this.trackingId)).thenReturn(cargoRoute);
		
		
		// Test1 
		// registerBooking
		String result = this.mvc.perform(post("/bookings")
				.content(TestUtils.asJsonString(newBooking))
				.contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON)).andReturn().getResponse().getContentAsString();
		// Set the bookingId using registerBooking result
		this.bookingId = result;
		// registerBooking result check
		assertNotNull("registerBooking should return bookingId", result);

		
		// Test2 
		// listUserBookings
		String listUserBookingsResultJson = this.mvc.perform(get("/bookings/of/" + this.userId))
				.andReturn().getResponse().getContentAsString();
		System.out.println("$$$$ listUserBookingsResult : " + listUserBookingsResultJson);
		// listUserBookings result check
		List<?> listUserBookingsResultList = (List<?>)par.parse(listUserBookingsResultJson);
		Map<String, String> listUserBookingsResultMap = (Map<String, String>) listUserBookingsResultList.get(0);
		assertTrue("listUserBooking by userId(TESTUSER) should return just one booking information after registerBooking",
				listUserBookingsResultList.size()==1);
		assertEquals("This booking's bookingId should be " + this.bookingId, listUserBookingsResultMap.get("bookingId"), this.bookingId);
		
		
		// Test3 
		// listNotAcceptedBookings
		String listNotAcceptedBookingsResultJson = this.mvc.perform(get("/bookings/not-accepted"))
				.andReturn().getResponse().getContentAsString();
		System.out.println("$$$$ listNotAcceptedBookingsResult : " + listNotAcceptedBookingsResultJson);
		List<?> listNotAcceptedBookingsResultList = (List<?>)par.parse(listNotAcceptedBookingsResultJson);
		// listNotAcceptedBookings result check
		assertTrue("listNotAcceptedBookings should return at least one of bookings", listNotAcceptedBookingsResultList.size()>=1);
		
		
		// Test4 
		// getBookingDetail
		String getBookingDetailResultJson = this.mvc.perform(get("/bookings/"+this.bookingId))
				.andReturn().getResponse().getContentAsString();
		System.out.println("$$$$ getBookingDetail : " + getBookingDetailResultJson);
		// getBookingDetailResultJson result check 
		// Current booking information check, before changeDestination and acceptBooking
		Map<String, String> getBookingDetailResultMap = (Map<String, String>)par.parse(getBookingDetailResultJson);
		assertEquals("Before acceptBooking, booking's Status should be NOT_ACCEPTED", getBookingDetailResultMap.get("bookingStatus"), BookingStatus.NOT_ACCEPTED.toString());
		assertEquals("Before changeDestination, booking's destination should be Tokyo (JNTKO)", getBookingDetailResultMap.get("finalDestination"), "Tokyo (JNTKO)");

		
		// Test5 
		// changeDestination
		this.mvc.perform(put("/bookings/"+this.bookingId+"/change-destination")
				.content(TestUtils.asJsonString(destination))
				.contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON));
		// changeDestination result check
		getBookingDetailResultJson = this.mvc.perform(get("/bookings/"+this.bookingId))
				.andReturn().getResponse().getContentAsString();
		getBookingDetailResultMap = (Map<String, String>)par.parse(getBookingDetailResultJson);
		assertEquals("After changeDestination, booking's destination should be change to Hong Kong (CNHKG)", getBookingDetailResultMap.get("finalDestination"), "Hong Kong (CNHKG)");
		
		
		// Test6 
		// acceptBooking
		this.mvc.perform(post("/bookings/"+this.bookingId+"/accept")
				.contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON));
		
		// acceptBooking result check
		verify(mockCargoTrackerService).registerCargo((Map<String, String>) any());
		getBookingDetailResultJson = this.mvc.perform(get("/bookings/"+this.bookingId))
				.andReturn().getResponse().getContentAsString();
		getBookingDetailResultMap = (Map<String, String>)par.parse(getBookingDetailResultJson);
		verify(mockCargoTrackerService).getCargo(this.trackingId);
		assertEquals("After acceptBooking, booking's status should be ACCEPTED", getBookingDetailResultMap.get("bookingStatus"), BookingStatus.ACCEPTED.toString());
		assertEquals("After accepted, booking has trackingId. It would be TESTTRID", getBookingDetailResultMap.get("trackingId"), this.trackingId);
		
	}
	
}
