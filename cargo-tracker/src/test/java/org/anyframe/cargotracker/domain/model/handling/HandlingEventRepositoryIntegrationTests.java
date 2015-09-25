package org.anyframe.cargotracker.domain.model.handling;

import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;

import java.util.Date;

import javax.persistence.EntityManager;

import org.anyframe.CargoTrackerSpringApplication;
import org.anyframe.cargotracker.domain.model.cargo.TrackingId;
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
@SpringApplicationConfiguration(classes=CargoTrackerSpringApplication.class)
@WebAppConfiguration
public class HandlingEventRepositoryIntegrationTests {

	@Autowired
	private HandlingEventRepository handlingEventRepository;
	
	@Autowired
    private EntityManager entityManager;
	
	@Value("ABC123")
	private String trackingStringId;
	
	private HandlingEvent handlingEvent, lastHandledEvent;
	
	private HandlingHistory handlingHistory;
	
	private TrackingId trackingId;
	
	@Before
	public void setUp() {
		this.trackingId = new TrackingId(trackingStringId);
		
		this.handlingHistory = handlingEventRepository.lookupHandlingHistoryOfCargo(this.trackingId);
	
		this.lastHandledEvent = handlingHistory.getMostRecentlyCompletedEvent();
	}
	
	/**
	 * Test1 storeTest
	 * input
	 * 	- new HandlingEvent
	 */
	@Test
	@Transactional
	public void storeTest() {
		// handlingEventRepository.store(HandlingEvent event);
		this.handlingEvent = new HandlingEvent(
				lastHandledEvent.getCargo(),
				new Date(2016, 11, 30, 10, 30),
				new Date(2016, 11, 30, 10, 30),
				lastHandledEvent.getType(),
				lastHandledEvent.getLocation(),
				lastHandledEvent.getVoyage()				
				);
		
		// Test method(store) Execution
		handlingEventRepository.store(this.handlingEvent);

		// Result check
		assertNotEquals("Stored new event, most recently completed event should be change",
				this.lastHandledEvent,
				handlingEventRepository.lookupHandlingHistoryOfCargo(this.trackingId).getMostRecentlyCompletedEvent());
	}

	/**
	 * Test2 lookupHandlingHistoryOfCargoTest
	 * input 
	 * 	- voyageNumber
	 */
	@Test
	@Transactional
	public void lookupHandlingHistoryOfCargoTest() {
		// Test method(lookupHandlingHistoryOfCargo) Execution
		HandlingHistory resultHandlingHistory = handlingEventRepository.lookupHandlingHistoryOfCargo(this.trackingId);
		
		// Result check
		assertNotNull("TrackingID ABC123 has handlingHistory",resultHandlingHistory);
	}
}
