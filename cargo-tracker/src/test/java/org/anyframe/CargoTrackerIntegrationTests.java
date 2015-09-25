package org.anyframe;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.anyframe.cargotracker.application.BookingService;
import org.anyframe.cargotracker.domain.model.cargo.Itinerary;
import org.anyframe.cargotracker.domain.model.cargo.Leg;
import org.anyframe.cargotracker.domain.model.cargo.RouteSpecification;
import org.anyframe.cargotracker.domain.model.location.Location;
import org.anyframe.cargotracker.domain.model.location.UnLocode;
import org.anyframe.cargotracker.domain.model.voyage.Schedule;
import org.anyframe.cargotracker.domain.model.voyage.Voyage;
import org.anyframe.cargotracker.domain.model.voyage.VoyageNumber;
import org.anyframe.cargotracker.domain.service.RoutingService;
import org.anyframe.cargotracker.util.TestUtils;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes=CargoTrackerSpringApplication.class)
@WebAppConfiguration
public class CargoTrackerIntegrationTests {
	
	@Mock
	private RoutingService mockRoutingService;
	
	@InjectMocks
	@Autowired
	private BookingService bookingService;
	
	@Autowired
	private WebApplicationContext context;
	
	private MockMvc mvc;
	
	@Value("ABC123") 
	private String trackingId; 
	
	@Value("CNHKG") 
	private String destinationLoCode;
	
	private String newTrackingId;
	
	@Before
	public void setUp(){
		// Mock setting
		MockitoAnnotations.initMocks(this);		
		this.mvc = MockMvcBuilders.webAppContextSetup(this.context).build();
	}
	
	@Test
	@Transactional
	public void cargoTrackerIntegrationTests() throws Exception {
		JSONParser par = new JSONParser();
		
		// Set the newCargo for registerCargo
		Map<String, String> newCargo = new HashMap<String, String>();
		newCargo.put("originUnlocode", "USCHI");
		newCargo.put("destinationUnlocode", "JNTKO");
		newCargo.put("arrivalDeadline", "2016-12-30");
		
		// Set the destination for changeDestination
		Map<String, String> destination = new HashMap<String, String>();
		destination.put("destinationUnlocode", "CNHKG");
		
		
		// Set variables for getRouteCandidates & assignItinerary
		List<Itinerary> routeList = new ArrayList<Itinerary>();
		List<Leg> legs = new ArrayList<Leg>();
		
		Leg leg1 = new Leg(
				new Voyage(new VoyageNumber("0400S"), new Schedule()),
				new Location(new UnLocode("USCHI"), "Chicago"),
				new Location(new UnLocode("SEGOT"), "Guttenburg"),
				new Date(),
				new Date());
		Leg leg2 = new Leg(
				new Voyage(new VoyageNumber("0300A"), new Schedule()),
				new Location(new UnLocode("SEGOT"), "Guttenburg"),
				new Location(new UnLocode("AUMEL"), "Melbourne"),
				new Date(),
				new Date());
		Leg leg3 = new Leg(
				new Voyage(new VoyageNumber("0300A"), new Schedule()),
				new Location(new UnLocode("AUMEL"), "Melbourne"),
				new Location(new UnLocode("NLRTM"), "Rotterdam"),
				new Date(),
				new Date());
		Leg leg4 = new Leg(
				new Voyage(new VoyageNumber("0400S"), new Schedule()),
				new Location(new UnLocode("NLRTM"), "Rotterdam"),
				new Location(new UnLocode("CNHKG"), "Shanghai"),
				new Date(),
				new Date());
	
		legs.add(leg1);
		legs.add(leg2);
		legs.add(leg3);
		legs.add(leg4);
		
		Itinerary itinerary = new Itinerary(legs);
		routeList.add(itinerary);
		
		// mockRoutingService given
		when(mockRoutingService.fetchRoutesForSpecification((RouteSpecification) any())).thenReturn(routeList);
		
		// Test1 
		// listAllCargos
		String listAllCargosResultJson = this.mvc.perform(get("/cargos"))
				.andReturn().getResponse().getContentAsString();
		System.out.println("$$$$ listAllCargosResult : " + listAllCargosResultJson);
		// listAllCargos result check
		List<?> listAllCargosResultList = (List<?>)par.parse(listAllCargosResultJson);
		// listNotAcceptedBookings result check
		assertTrue("listAllCargos should return at least one of bookings", listAllCargosResultList.size()>=1);
		
		
		// Test2
		// registerCargo
		this.newTrackingId = this.mvc.perform(post("/cargos/registration")
				.content(TestUtils.asJsonString(newCargo))
				.contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON)).andReturn().getResponse().getContentAsString();
		System.out.println("$$$$ newTrackingId : " + this.newTrackingId);
		// registerBooking result check
		assertNotNull("registerCargo should return trackingId", this.newTrackingId);
		
		
		// Test3
		// getCargo
		String getCargoResultJson = this.mvc.perform(get("/cargos/"+this.newTrackingId))
				.andReturn().getResponse().getContentAsString();
		System.out.println("$$$$ getCargo : " + getCargoResultJson);
		// getCargo result check
		Map<String, String> getCargoResultMap = (Map<String, String>)par.parse(getCargoResultJson);
		assertEquals("Before assignItinerary, booking's routed would be false", getCargoResultMap.get("routed"), false);
		assertEquals("Booking's destination should be Tokyo (JNTKO)", getCargoResultMap.get("finalDestination"), "Tokyo (JNTKO)");

		
		// Test4
		// changeDestination
		// Befor changeDestination, cargo check
		String jsonResult = this.mvc.perform(get("/cargos/" + this.newTrackingId)).andReturn().getResponse().getContentAsString();
		Map<String, String> map = (Map<String,String>)par.parse(jsonResult);
		assertNotEquals("After changeDestination destination would not be Hong Kong (CNHKG)", "Hong Kong (CNHKG)", map.get("finalDestination"));
		// changeDestination
		this.mvc.perform(post("/cargos/{trackingId}/change-destination",this.newTrackingId)
				.contentType("application/json")
				.content("{\"trackingId\": \"" + this.newTrackingId + "\", \"destinationUnlocode\": \"" + this.destinationLoCode + "\"}"));
		// changeDestination result check
		jsonResult = this.mvc.perform(get("/cargos/" + this.newTrackingId)).andReturn().getResponse().getContentAsString();
		System.out.println("changeDestination Result : " + jsonResult);
		map = (Map<String,String>)par.parse(jsonResult);

		assertEquals("Change Destination Result would be Hong Kong (CNHKG)", "Hong Kong (CNHKG)", map.get("finalDestination"));			
		
		// Test5
		// getRouteCandidates
		String getRouteCandidatesResultJson = this.mvc.perform(get("/cargos/candidates")
				.param("trackingId", this.newTrackingId))
				.andReturn().getResponse().getContentAsString();
		System.out.println("$$$$ getRouteCandidates : " + getRouteCandidatesResultJson);
		List<?> getRouteCandidatesResultList = (List<?>)par.parse(getRouteCandidatesResultJson);
		
		assertTrue("getRouteCandidates would return Itineraries list", getRouteCandidatesResultList.size()>0);
		
	}

}
