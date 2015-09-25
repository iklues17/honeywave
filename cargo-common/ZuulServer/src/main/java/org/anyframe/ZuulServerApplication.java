package org.anyframe;

import java.util.List;

import org.anyframe.gateway.auth.authentication.filter.FilterResponseErrorHandler;
import org.anyframe.gateway.core.filter.SimpleCORSFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;

@EnableDiscoveryClient
@EnableZuulProxy
@SpringBootApplication
public class ZuulServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ZuulServerApplication.class, args);
    }
//	@Bean
//	public SimpleCORSFilter SimpleCORSFilter() {
//		SimpleCORSFilter filter = new SimpleCORSFilter();
//	    return filter;
//	}

	@Bean
	public ObjectMapper jacksonObjectMapper() {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.setSerializationInclusion(Include.NON_NULL);
		return objectMapper;
	}
	
	@Bean
	public FilterResponseErrorHandler filterResponseErrorHandler(){
		return new FilterResponseErrorHandler();
	}
	
	@Bean
	public RestTemplate restTemplate(FilterResponseErrorHandler filterResponseErrorHandler) {
		RestTemplate restTemplate = new RestTemplate();
//		restTemplate.setErrorHandler(filterResponseErrorHandler);
		List<HttpMessageConverter<?>> converters = restTemplate.getMessageConverters();
		for (HttpMessageConverter<?> converter : converters) {
			if(converter  instanceof MappingJackson2HttpMessageConverter){
				MappingJackson2HttpMessageConverter jsonConverter = (MappingJackson2HttpMessageConverter) converter;
//			    jsonConverter.setObjectMapper(objectMapper);
			    jsonConverter.setObjectMapper(jacksonObjectMapper());
			}
		}

		return restTemplate;
	}
}
