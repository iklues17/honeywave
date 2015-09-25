package org.anyframe.pathfinder.interfaces;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import java.util.Map;

import org.anyframe.CargoTrackerPathfinderApplication;
import org.json.simple.parser.JSONParser;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes=CargoTrackerPathfinderApplication.class)
@WebAppConfiguration
public class GraphTraversalServiceUnitTests {
	
	@Autowired
	private WebApplicationContext context;
	
	private MockMvc mvc;
	
	@Value("USCHI")
	private String originUnLocode;
	
	@Value("JNTKO")
	private String destinationUnLocode;
	
	@Value("2016-12-31")
	private String deadline;
	
	@Before
	public void setUp() {
		this.mvc = MockMvcBuilders.webAppContextSetup(this.context).build();
	}
	
	/**
	 * Test findShortestPathTest
	 * input data
	 * 	- originUnLocode : USCHI
	 *  - destinationUnLocode : JNTKO
	 *  - deadline : 2016-12-31
	 */
	@Test
	public void findShortestPathTest() throws Exception {
		JSONParser par = new JSONParser();
		Map<String, String> resultMap = null;
		
		// Current check
		assertNull("Before findShortestPath not excuted, resultMap would be null", resultMap);
		
		// Test method(findShortestPath) call
		String jsonResult =  this.mvc.perform(get("/shortest-path?origin={origin}&destination={destination}&deadline={deadline}",
				this.originUnLocode,
				this.destinationUnLocode,
				this.deadline)).andReturn().getResponse().getContentAsString();

		// Result check
		resultMap = (Map<String,String>)par.parse(jsonResult);
		
		assertNotNull("findShortestPath would return tranistPaths", resultMap);
	}
}
