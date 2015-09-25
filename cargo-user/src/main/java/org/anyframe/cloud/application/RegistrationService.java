package org.anyframe.cloud.application;

import org.anyframe.cloud.domain.RegisteredUser;

/**
 * Cargo Tracker Management Portal's User Resgistration service
 * @author Hahn
 */
public interface RegistrationService {

	String registerNewUser(RegisteredUser registeredUser, String password);

	void withdrawalUser(RegisteredUser registeredUser);

	RegisteredUser isRegistered(String emailAddress);
	
}
