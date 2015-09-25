package org.anyframe.gateway.auth.authentication.filter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.anyframe.gateway.auth.authentication.AuthServerConfiguration;
import org.anyframe.gateway.auth.authentication.exception.AuthorizationException;
import org.anyframe.gateway.auth.authentication.exception.HttpClientError;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonJsonParser;
import org.springframework.boot.json.JsonSimpleJsonParser;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

@Component
public class CheckAccessTokenFilter extends ZuulFilter {

	@Autowired
	private RestTemplate restTemplate;
	
	@Autowired
	private ObjectMapper jacksonObjectMapper;
	
	@Autowired
	private AuthServerConfiguration authServerConfig; 
			
	@Override
	public Object run() {
		RequestContext ctx = RequestContext.getCurrentContext();
		String auth_server_uri = authServerConfig.getBaseUrl() + authServerConfig.getCheckTokenUrl();
		
		try {
			String authHeader = ctx.getRequest().getHeader("Authorization");
			if(authHeader == null) {
				authHeader = "bearer ";
			}
			String[] bearer_token = authHeader.trim().split(" ");
			String accessToken = bearer_token[bearer_token.length-1];
			System.out.println("##### Token Validation ##### Start");
			ResponseEntity<String> exchange = restTemplate.exchange(auth_server_uri, HttpMethod.GET, null, String.class, accessToken);
			System.out.println("##### Token Validation ##### Code : " + exchange.getStatusCode().value());
			System.out.println("##### Token Validation ##### Body : " + exchange.getBody());
		} catch (HttpClientErrorException e){
			HttpClientError clientError = null;
			try {
				clientError = jacksonObjectMapper.readValue(e.getResponseBodyAsString(), HttpClientError.class);
			} catch (IOException e1) {
				e1.printStackTrace();
			}
			throw new AuthorizationException(HttpStatus.UNAUTHORIZED, clientError.getError_description(), e.getResponseBodyAsByteArray(), null);
		} catch (Exception e) {
			throw new AuthorizationException(HttpStatus.INTERNAL_SERVER_ERROR, "An error has occurred during the authentication process", e.getMessage().getBytes(), null);
		}
		
		return null;
	}

	@Override
	public boolean shouldFilter() {
		RequestContext ctx = RequestContext.getCurrentContext();
		HttpServletRequest request = ctx.getRequest();
		
//		if(request.getRequestURI().equals("/auth"+authServerConfig.getGetTokenUrl().split("\\?")[0])){
		if(request.getRequestURI().startsWith("/auth/oauth")){
			return false;
		}
		return true;
	}

	@Override
	public int filterOrder() {
		return 0;
	}

	@Override
	public String filterType() {
		return "pre";
	}

}
