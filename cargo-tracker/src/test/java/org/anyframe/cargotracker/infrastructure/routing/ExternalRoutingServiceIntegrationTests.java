package org.anyframe.cargotracker.infrastructure.routing;

import static org.junit.Assert.assertNotNull;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.anyframe.CargoTrackerSpringApplication;
import org.anyframe.cargotracker.domain.model.cargo.Itinerary;
import org.anyframe.cargotracker.domain.model.cargo.RouteSpecification;
import org.anyframe.cargotracker.domain.model.location.Location;
import org.anyframe.cargotracker.domain.model.location.UnLocode;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = CargoTrackerSpringApplication.class)
@WebAppConfiguration
public class ExternalRoutingServiceIntegrationTests {

    @Autowired
	private ExternalRoutingService externalRoutingService;

	@Before
	public void setUp() throws Exception, SecurityException {
		// Rest target change (via eureka -> direct call)
		ReflectionTestUtils.setField(externalRoutingService, "applicationUri", "http://localhost:29001");
		ReflectionTestUtils.setField(externalRoutingService, "restTemplate", new RestTemplate());
	}

	/**
	 * Test fetchRoutesForSpecificationTest
	 * input
	 * 	- routeSpecification
	 * Rest target 
	 * 	- Pathfinder
	 */
	@Test
	public void fetchRoutesForSpecificationTest() throws ParseException   {
		// Setting
		Location origin = new Location(new UnLocode("CNHKG"), "Hong Kong");
		Location destination = new Location(new UnLocode("DEHAM"), "Hamburg");
		Date arrivalDeadline = new SimpleDateFormat("yyyy-MM-dd").parse("2016-12-30");

		RouteSpecification routeSpecification = new RouteSpecification(origin,
				destination, arrivalDeadline);
		
		// Test method(fetchRoutesForSpecification) Execution
		List<Itinerary> resultList = externalRoutingService
				.fetchRoutesForSpecification(routeSpecification);

		// Result check
		assertNotNull("fetchRoutesForSpecification should return Itinerary list", resultList.get(0));
	}

}
