package org.anyframe.cargotracker.domain.model.location;

import static org.junit.Assert.assertEquals;

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
public class LocationRepositoryIntegrationTests {

	@Autowired
	private LocationRepository locationRepository;
	
	private UnLocode unLocode;
	
	@Value("USCHI")
	private String locationUnLocode;
	
	@Before
	public void setUp(){
		unLocode = new UnLocode(locationUnLocode);
	}
	
	/**
	 * Test1 findTest
	 * input : locationUnLocode
	 */
	@Test
	@Transactional
	public void findTest() {
		// Test method(find) Execution
		Location resultLocation = locationRepository.find(unLocode);
				
		// Result check
		assertEquals("Result location would be Chicago (USCHI)", "Chicago", resultLocation.getName());
	}
	
	/**
	 * Test2 findAllTest
	 */
	@Test
	@Transactional
	public void findAllTest() {
		// Test method(findAll) Execution
		List<Location> resultLocations = locationRepository.findAll();
		
		// Result check
		assertEquals("Result locations would be 13 locations", resultLocations.size(), 13);
		
	}
}
