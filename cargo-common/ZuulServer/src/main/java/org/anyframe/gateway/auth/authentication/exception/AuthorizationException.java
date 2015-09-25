package org.anyframe.gateway.auth.authentication.exception;

import java.nio.charset.Charset;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

public class AuthorizationException extends HttpClientErrorException {
	private static final long serialVersionUID = 1L;

	public AuthorizationException(HttpStatus statusCode) {
		super(statusCode);
	}

	public AuthorizationException(HttpStatus statusCode, String statusText) {
		super(statusCode, statusText);
	}

	public AuthorizationException(HttpStatus statusCode, String statusText,
			byte[] responseBody, Charset responseCharset) {
		super(statusCode, statusText, responseBody, responseCharset);
	}

	public AuthorizationException(HttpStatus statusCode, String statusText,
			HttpHeaders responseHeaders, byte[] responseBody,
			Charset responseCharset) {
		super(statusCode, statusText, responseHeaders, responseBody,
				responseCharset);
	}

}
