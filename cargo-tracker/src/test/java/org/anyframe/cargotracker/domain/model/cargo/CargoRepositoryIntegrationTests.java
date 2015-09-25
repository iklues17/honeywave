package org.anyframe.cargotracker.domain.model.cargo;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import java.util.List;

import org.anyframe.CargoTrackerSpringApplication;
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
public class CargoRepositoryIntegrationTests {

	@Autowired
	private CargoRepository cargoRepository;
	
	private Cargo cargo, sampleCargo;
	
	private TrackingId trackingId;
	
	@Value("ABC123")
	private String trackingStringId;
	
	@Value("CBA321")
	private String newTrackingStringId;
	
	@Before
	public void setUp() throws Exception {
		this.trackingId = new TrackingId(this.trackingStringId);
		
		sampleCargo = cargoRepository.find(this.trackingId);
	}
	
	/**
	 * Test1 findTest
	 * input
	 * 	- trackingId
	 */
	@Test
	@Transactional
	public void findTest() {
		// Test method(find) Execution
		Cargo foundCargo = cargoRepository.find(this.trackingId);
		
		// Result check
		assertEquals("Found cargo's tracking id would be ABC123", this.trackingId, foundCargo.getTrackingId());
		
	}
	
	/**
	 * Test2 storeTest
	 * input
	 * 	- new Cargo(by sampleCargo, newTrackingStringId)
	 */
	@Test
	@Transactional
	public void storeTest() {
		// Setup for store
		this.cargo = new Cargo(new TrackingId(this.newTrackingStringId),
				this.sampleCargo.getRouteSpecification());
		
		// Test method(store) Execution
		cargoRepository.store(cargo);
		
		// Result check
		Cargo resultCargo = cargoRepository.find(new TrackingId(this.newTrackingStringId));
		
		assertEquals("Stored cargo's tracking id should be CBA321", this.newTrackingStringId, resultCargo.getTrackingId().getIdString());
	}
	
	/**
	 * Test3 nextTrackingIdTest
	 */
	@Test
	@Transactional
	public void nextTrackingIdTest() {
		// Test method(nextTrackingId) Execution
		TrackingId generatedTrackingId = cargoRepository.nextTrackingId();
		
		// Result check
		assertNotNull("Generated TrackingId would be not null", generatedTrackingId);
	}
	
	/**
	 * Test4 findAllTest
	 */
	@Test
	@Transactional
	public void findAllTest() {
		List<Cargo> resultCargos = null;
		// Current check
		assertNull("ResultCargos woud be null before findAll executed", resultCargos);
		
		// Test method(findAll) Execution
		resultCargos = cargoRepository.findAll();
		
		// Result check
		assertNotNull("After findAll, ResultCargos would be not null", resultCargos);
		
	}
	
}
