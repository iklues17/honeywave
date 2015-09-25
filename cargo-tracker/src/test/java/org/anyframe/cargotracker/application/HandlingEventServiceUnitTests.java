package org.anyframe.cargotracker.application;


import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.anyframe.CargoTrackerSpringApplication;
import org.anyframe.cargotracker.domain.model.cargo.TrackingId;
import org.anyframe.cargotracker.domain.model.handling.HandlingEvent;
import org.anyframe.cargotracker.domain.model.handling.HandlingEventFactory;
import org.anyframe.cargotracker.domain.model.handling.HandlingEventRepository;
import org.anyframe.cargotracker.domain.model.location.UnLocode;
import org.anyframe.cargotracker.domain.model.voyage.VoyageNumber;
import org.anyframe.cargotracker.util.TestUtils;
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
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes=CargoTrackerSpringApplication.class)
@WebAppConfiguration
public class HandlingEventServiceUnitTests {

	@Mock
	private ApplicationEvents mockApplicationEvents;
	
	@Mock
	private HandlingEventRepository mockHandlingEventRepository;
	
	@Mock
    private HandlingEventFactory mockHandlingEventFactory;
	
	@InjectMocks
	@Autowired
	private HandlingEventService handlingEventService;
	
	@Value("ABC123")
	private String trackingId;
	
	@Value("0300A")
	private String voyageNumber;
	
	@Value("USCHI")
	private String unLocode;
	
	@Before
	public void setUp() throws Exception {
		// Mock setting
		MockitoAnnotations.initMocks(this);
		
		ReflectionTestUtils.setField(TestUtils.unwrapProxy(handlingEventService), "applicationEvents", mockApplicationEvents);
		ReflectionTestUtils.setField(TestUtils.unwrapProxy(handlingEventService), "handlingEventRepository", mockHandlingEventRepository);
		ReflectionTestUtils.setField(TestUtils.unwrapProxy(handlingEventService), "handlingEventFactory", mockHandlingEventFactory);
		
	}
	
	/**
	 * Test registerHandlingEventTest
	 * input
	 * 	- completionTime
	 *  - trackingId
	 *  - voyageNumber
	 *  - unLocode
	 */
	@Test
	@Transactional
	public void registerHandlingEventTest() throws Exception {
		// Setting
		Date completionTime = new SimpleDateFormat("yyyy-MM-dd hh:mm").parse("2016-12-30 12:00");
		TrackingId trackingId = new TrackingId(this.trackingId);
		VoyageNumber voyageNumber = new VoyageNumber(this.voyageNumber);
		UnLocode unLocode = new UnLocode(this.unLocode);
		
		when(mockHandlingEventFactory.createHandlingEvent(
				(Date) any(), (Date) any(), (TrackingId) any(), (VoyageNumber) any(), (UnLocode) any(), (HandlingEvent.Type) any()))
			.thenReturn(new HandlingEvent());
		
		// Test method(registerHandlingEvent) Execution
		handlingEventService.registerHandlingEvent(completionTime, trackingId, voyageNumber, unLocode, HandlingEvent.Type.LOAD);
		
		// Result check
		verify(mockHandlingEventFactory).createHandlingEvent(
				(Date) any(), (Date) any(), (TrackingId) any(), (VoyageNumber) any(), (UnLocode) any(), (HandlingEvent.Type) any());
		verify(mockHandlingEventRepository).store((HandlingEvent) any()); 
		verify(mockApplicationEvents).cargoWasHandled((HandlingEvent) any()); 
		
	}
}
