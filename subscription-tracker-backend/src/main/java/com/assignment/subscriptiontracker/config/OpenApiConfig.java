package com.assignment.subscriptiontracker.config;

import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@OpenAPIDefinition(
    info = @Info(
        title = "Subscription Tracker API",
        version = "v1",
        description = "API documentation for the Subscription Tracker backend"
    )
)
@Configuration
public class OpenApiConfig {
    // This class only contains OpenAPI metadata through annotations.
}
