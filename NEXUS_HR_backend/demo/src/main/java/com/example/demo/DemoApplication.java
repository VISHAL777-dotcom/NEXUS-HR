package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class DemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);

		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

		String hash = "$2a$10$DlJ44ISu4gUbVjtRMxkEm.WABFZFg8lr7z9sYDbtBpEyW5LMp/BJW";

		System.out.println("MATCH: " + encoder.matches("my@123", hash));
	}
}