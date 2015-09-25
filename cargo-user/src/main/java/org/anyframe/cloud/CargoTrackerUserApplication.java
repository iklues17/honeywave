package org.anyframe.cloud;

import static springfox.documentation.builders.PathSelectors.regex;

import java.util.List;

import org.anyframe.cloud.infrastructure.api.swagger.SwaggerConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.service.ApiInfo;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Predicate;

@SpringBootApplication
@EnableDiscoveryClient
@Import({SwaggerConfiguration.class})
public class CargoTrackerUserApplication {

    public static void main(String[] args) {
        SpringApplication.run(CargoTrackerUserApplication.class, args);
    }

    @Bean
    public Predicate<String> swaggerPaths() {
      return regex("/users.*|/sign.*|/log.*|/withdrawal.*|/cargo.*");
    }

    @Bean
    public ApiInfo apiInfo() {
      return new ApiInfoBuilder()
              .title("Cargo User API")
              .description("Cargo Tracker User API")
              .contact("Anyframe Cloud Edition")
              .license("Anyframe Cloud Ed.")
              .version("1.0")
              .build();
    }

	public ObjectMapper jacksonObjectMapper() {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.setSerializationInclusion(Include.NON_NULL);
		return objectMapper;
	}
	
	@Bean
	public RestTemplate springRestTemplate() {
		RestTemplate restTemplate = new RestTemplate();
		List<HttpMessageConverter<?>> converters = restTemplate.getMessageConverters();
		for (HttpMessageConverter<?> converter : converters) {
			if(converter  instanceof MappingJackson2HttpMessageConverter){
				MappingJackson2HttpMessageConverter jsonConverter = (MappingJackson2HttpMessageConverter) converter;
			    jsonConverter.setObjectMapper(jacksonObjectMapper());
			}
		}
		return restTemplate;
	}

}
