package org.anyframe.cargotracker.application;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import org.anyframe.CargoTrackerSpringApplication;
import org.anyframe.cargotracker.domain.model.cargo.Cargo;
import org.anyframe.cargotracker.domain.model.cargo.CargoRepository;
import org.anyframe.cargotracker.domain.model.cargo.Itinerary;
import org.anyframe.cargotracker.domain.model.cargo.RouteSpecification;
import org.anyframe.cargotracker.domain.model.cargo.TrackingId;
import org.anyframe.cargotracker.domain.model.location.Location;
import org.anyframe.cargotracker.domain.model.location.LocationRepository;
import org.anyframe.cargotracker.domain.model.location.UnLocode;
import org.anyframe.cargotracker.domain.service.RoutingService;
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
@SpringApplicationConfiguration(classes=CargoTrackerSpringApplication.class)
@WebAppConfiguration
public class BookingServiceUnitTests {

	@Mock
	private RoutingService mockRoutingService;
	
	@Mock
	private LocationRepository mockLocationRepository;
	
	@Mock
	private CargoRepository mockCargoRepository;
	
	@InjectMocks
	@Autowired
	private BookingService bookingService;
	
	@Value("USCHI")
	private String originUnLocode;
	
	@Value("JNTKO")
	private String destinationUnLocode;
	
	@Value("2016-12-30")
	private String arrivalDeadline;
	
	private TrackingId trackingId;
	
	private Cargo cargo;
	
	@Before
	public void setUp() {
		// Mock setting
		MockitoAnnotations.initMocks(this);
		
		this.trackingId = new TrackingId("ABC123");
		
		this.cargo = new Cargo(this.trackingId, 
				new RouteSpecification(
						new Location(new UnLocode("USCHI"), "Chicago"),
						new Location(new UnLocode("JNTKO"), "Tokyo"),
						new Date())
				);
	}
	
	/**
	 * Test1 bookNewCargoTest
	 * input
	 * 	- originUnLocode
	 * 	- destinationUnLocode
	 * 	- arrivalDeadline
	 */
	@Test
	@Transactional
	public void bookNewCargoTest() throws Exception {
		// Setting
		UnLocode origin = new UnLocode(this.originUnLocode);
		UnLocode destination = new UnLocode(this.destinationUnLocode);
		Date arrivalDeadline = new SimpleDateFormat("yyyy-mm-dd").parse(this.arrivalDeadline);
		
		when(mockCargoRepository.nextTrackingId()).thenReturn(this.trackingId);
		when(mockLocationRepository.find(origin)).thenReturn(new Location(origin, "Chicago"));
		when(mockLocationRepository.find(destination)).thenReturn(new Location(destination, "Tokyo"));
		
		TrackingId resultTrackingId = null;
		
		// Current trackingId check
		assertNull("TrackingId should be null, before excute bookNewCargo", resultTrackingId);
		
		// Test method(bookNewCargo) Execution
		resultTrackingId = bookingService.bookNewCargo(origin, destination, arrivalDeadline);
		
		// Result check
		assertNotNull("After executed bookNewCargo, trackingId should be not null", resultTrackingId);
		verify(mockCargoRepository).nextTrackingId();
		verify(mockLocationRepository).find(origin);
		verify(mockLocationRepository).find(destination);
		verify(mockCargoRepository).store((Cargo) any());
	}
	
	/**
	 * Test2 requestPossibleRoutesForCargoTest
	 * input
	 * 	- trackingId
	 */
	@Test
	@Transactional
	public void requestPossibleRoutesForCargoTest() {
		// Setting
		when(mockCargoRepository.find(this.trackingId)).thenReturn(new Cargo());
		
		when(mockRoutingService.fetchRoutesForSpecification((RouteSpecification) any())).thenReturn(new ArrayList<Itinerary>());
		
		// Test method(requestPossibleRoutesForCargo) Execution
		bookingService.requestPossibleRoutesForCargo(this.trackingId);
		
		// Result check
		verify(mockCargoRepository).find(this.trackingId);
		verify(mockRoutingService).fetchRoutesForSpecification((RouteSpecification) any());
	}
	
	/**
	 * Test3 assignCargoToRouteTest
	 * input
	 * 	- ininerary
	 *  - trackingId
	 */
	@Test
	@Transactional
	public void assignCargoToRouteTest() {
		// Setting
		when(mockCargoRepository.find(this.trackingId)).thenReturn(this.cargo);
				
		Itinerary ininerary = new Itinerary();
		
		bookingService.assignCargoToRoute(ininerary, this.trackingId);
		
		// Result check
		verify(mockCargoRepository).find(this.trackingId);
		verify(mockCargoRepository).store((Cargo) any());
	}
	
	/**
	 * Test4 changeDestinationTest
	 * input
	 * 	- originUnLocode
	 * 	- destinationUnLocode
	 *  - arrivalDeadline
	 */
	@Test
	@Transactional
	public void changeDestinationTest() {
		// Setting
		UnLocode targetDestinationUnLocode = new UnLocode("CNSHA");
		Location targetDestinationLocation = new Location(new UnLocode("CNSHA"), "Shanghai");
		when(mockCargoRepository.find(this.trackingId)).thenReturn(this.cargo);
		when(mockLocationRepository.find(targetDestinationUnLocode)).thenReturn(targetDestinationLocation);
		
		// Test method(changeDestination) Execution
		bookingService.changeDestination(this.trackingId, targetDestinationUnLocode);
		
		// Result check
		verify(mockCargoRepository).find(this.trackingId);
		verify(mockLocationRepository).find(targetDestinationUnLocode);
		verify(mockCargoRepository).store(this.cargo);
	}
	
}
