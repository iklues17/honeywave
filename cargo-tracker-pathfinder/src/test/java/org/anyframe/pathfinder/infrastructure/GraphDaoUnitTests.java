package org.anyframe.pathfinder.infrastructure;

import static org.junit.Assert.assertNotNull;

import java.util.List;

import org.anyframe.CargoTrackerPathfinderApplication;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes=CargoTrackerPathfinderApplication.class)
@WebAppConfiguration
public class GraphDaoUnitTests {
	
	@Autowired
	private GraphDao graphDao;
	
	@Value("JNTKO")
	private String from;
	
	@Value("USDAL")
	private String to;
	
	/**
	 * Test1 listLocationsTest
	 */
	@Test
	public void listLocationsTest() {
		List<String> resultList = null;
		// Test method(listLocations) Execution
		resultList = graphDao.listLocations();
		
		// Result check
		assertNotNull("listLocations would be return location list", resultList);
	}
	
	/**
	 * Test2 getVoyageNumberTest
	 */
	@Test
	public void getVoyageNumberTest() {
		String voyageNumber = null;
		// Test method(getVoyageNumber) Execution
		voyageNumber = graphDao.getVoyageNumber(from, to);
		
		// Result check
		assertNotNull("getVoyageNumber would be return new voyage number", voyageNumber);
	}

}
