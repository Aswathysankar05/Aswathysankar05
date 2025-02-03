package com.servicedesk.springboot_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.servicedesk.springboot_backend.entity.Incident;
import com.servicedesk.springboot_backend.entity.Servicesupport;

@Configuration
public class MydataRestConfig implements RepositoryRestConfigurer {

        // private String theAllowedOrigins =
        // "https://servicedesk-dev.cloudplusinfotech.com";
        private String theAllowedOrigins = "https://servicedesk-dev.cloudplusinfotech.com";

        @Override
        public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

                HttpMethod[] theUnsupportedActions = {
                                // HttpMethod.PATCH,
                                // HttpMethod.DELETE,
                                // HttpMethod.PUT
                };

                config.exposeIdsFor(Incident.class);
                config.exposeIdsFor(Servicesupport.class);
                disableHttpMethods(Incident.class, config, theUnsupportedActions);
                disableHttpMethods(Servicesupport.class, config, theUnsupportedActions);

                // Configure CORS Mapping
                cors.addMapping(config.getBasePath() + "/**")
                                .allowedOrigins(theAllowedOrigins);

        }

        private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config,
                        HttpMethod[] theUnsupportedActions) {

                config.getExposureConfiguration()
                                .forDomainType(theClass)
                                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                                .withCollectionExposure(
                                                (metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));

        }

}