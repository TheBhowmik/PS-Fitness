package com.gym_system.PS_fitness.service;

import org.springframework.stereotype.Service;

@Service
public class SmsService {
    public void sendSms(String to, String message) {
        System.out.println("========== MOCK SMS SENT ==========");
        System.out.println("To: " + to);
        System.out.println("Message: " + message);
        System.out.println("===================================");
    }
}