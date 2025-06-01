package com.coveragex.todobackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main Spring Boot application class for the Todo Backend API.*
 * This class serves as the entry point for the Spring Boot application.
 * @EnableJpaAuditing enables automatic population of audit fields like createdAt, updatedAt
 */
@SpringBootApplication
@EnableJpaAuditing
public class TodoBackendApplication {

	/**
	 * Main method that starts the Spring Boot application
	 * @param args command line arguments
	 */
	public static void main(String[] args) {
		SpringApplication.run(TodoBackendApplication.class, args);
		System.out.println("🚀 Todo Backend API is running on http://localhost:8080");
		System.out.println("📚 API Documentation: http://localhost:8080/api/docs");
	}
}