package com.servicedesk.springboot_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.servicedesk.springboot_backend")
public class SpringbootBackendApplication {

	public static void main(String[] args) {

		SpringApplication.run(SpringbootBackendApplication.class, args);
	}
}
