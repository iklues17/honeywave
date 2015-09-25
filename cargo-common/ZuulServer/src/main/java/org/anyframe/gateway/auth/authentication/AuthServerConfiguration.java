package org.anyframe.gateway.auth.authentication;

import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class AuthServerConfiguration implements EnvironmentAware {
		
	private String baseUrl;
	private String getTokenUrl;
	private String checkTokenUrl;

	public String getBaseUrl() {
		return baseUrl;
	}
	public String getGetTokenUrl() {
		return getTokenUrl;
	}
	public String getCheckTokenUrl() {
		return checkTokenUrl;
	}

	@Override
	public void setEnvironment(Environment env) {
		this.baseUrl = "http://70.121.244.13:8070";
		this.checkTokenUrl = "/auth/oauth/check_token?token={access_token}";
		this.getTokenUrl = "/auth/oauth/token?grant_type={grantType}";
	}
}
