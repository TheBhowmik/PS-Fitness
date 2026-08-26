package com.gym_system.PS_fitness.controller;

import com.gym_system.PS_fitness.dto.LoginRequest;
import com.gym_system.PS_fitness.model.Member;
import com.gym_system.PS_fitness.repository.MemberRepository;
import com.gym_system.PS_fitness.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {

        // 1. Find the user by email
        Optional<Member> memberOpt = memberRepository.findByEmail(loginRequest.getEmail());

        // 2. Check if user exists AND if the passwords match
        if (memberOpt.isPresent()) {
            Member member = memberOpt.get();

            // passwordEncoder.matches(rawPassword, hashedPassword)
            if (passwordEncoder.matches(loginRequest.getPassword(), member.getPassword())) {

                // Pass BOTH the email and the role into the token generator
                String token = jwtUtil.generateToken(member.getEmail(), member.getRole());
                return ResponseEntity.ok(token);
            }
        }

        // 4. If email not found or password incorrect, return 401 Unauthorized
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }
}