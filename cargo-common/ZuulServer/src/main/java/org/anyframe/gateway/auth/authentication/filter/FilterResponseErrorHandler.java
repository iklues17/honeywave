package org.anyframe.gateway.auth.authentication.filter;

import java.io.IOException;

import org.anyframe.gateway.core.util.RestUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.ResponseErrorHandler;

public class FilterResponseErrorHandler implements ResponseErrorHandler {
    private static final Logger log = LoggerFactory.getLogger(FilterResponseErrorHandler.class);

    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        log.error("Response error: {} {}", response.getStatusCode(), response.getStatusText());
    }

    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        return RestUtil.isError(response.getStatusCode());
    }
}
