package org.anyframe.cloud.infrastructure.persistence;

import org.anyframe.cloud.domain.RegisteredUser;


public interface RegisteredUserRepository {
	
	RegisteredUser findByLoginName(String loginName);
	
	RegisteredUser findByEmailAddress(String emailAddress);
	
}
