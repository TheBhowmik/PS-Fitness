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

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allows your Vite frontend to connect
@RequiredArgsConstructor
public class AuthController {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // --- NEW: Registration Endpoint ---
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Member member) {
        // 1. Check if the email already exists to prevent duplicates
        if (memberRepository.findByEmail(member.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already registered.");
        }

        // 2. Hash the plain text password before saving to PostgreSQL
        member.setPassword(passwordEncoder.encode(member.getPassword()));

        // 3. Set default values for a new user
        member.setRole("USER");
        member.setJoiningDate(LocalDate.now());
        member.setNextPaymentDate(LocalDate.now().plusMonths(1));

        // 4. Save to database
        memberRepository.save(member);

        return ResponseEntity.ok("Registration successful");
    }

    // --- EXISTING: Login Endpoint ---
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        Optional<Member> memberOpt = memberRepository.findByEmail(loginRequest.getEmail());

        if (memberOpt.isPresent()) {
            Member member = memberOpt.get();

            if (passwordEncoder.matches(loginRequest.getPassword(), member.getPassword())) {
                String token = jwtUtil.generateToken(member.getEmail(), member.getRole());
                return ResponseEntity.ok(token);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }
}