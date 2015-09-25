package org.anyframe.gateway.auth.authentication.filter;

import org.anyframe.gateway.auth.authentication.exception.AuthorizationException;
import org.springframework.stereotype.Component;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;

@Component
public class AccessTokenErrorHandleFilter extends ZuulFilter {

	@Override
	public Object run() {

		RequestContext ctx = RequestContext.getCurrentContext();
		AuthorizationException ae = (AuthorizationException) ((ZuulException) ctx.getThrowable()).getCause();

		ctx.setResponseStatusCode(ae.getStatusCode().value());
		ctx.setResponseBody(ae.getResponseBodyAsString());
		
		return null;
	}

	@Override
	public boolean shouldFilter() {
		RequestContext ctx = RequestContext.getCurrentContext();
		Throwable throwable = ctx.getThrowable();
		if(throwable instanceof ZuulException){
			ZuulException ze = (ZuulException) throwable;
			if("pre:CheckAccessTokenFilter".equals(ze.errorCause)){
				return ze.getCause() instanceof AuthorizationException;
			}
		}
		return true;
	}

	@Override
	public int filterOrder() {
		return 0;
	}

	@Override
	public String filterType() {
		return "error";
	}

}
