package com.gym_system.PS_fitness.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}