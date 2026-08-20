package com.gym_system.PS_fitness;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // <-- Add this!
public class PsFitnessApplication {
	public static void main(String[] args) {
		SpringApplication.run(PsFitnessApplication.class, args);
	}
}