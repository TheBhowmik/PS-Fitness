package com.gym_system.PS_fitness.controller;

import com.gym_system.PS_fitness.model.Member;
import com.gym_system.PS_fitness.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*") // Allows your frontend to make requests
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/register")
    public ResponseEntity<Member> register(@RequestBody Member member) {
        Member savedMember = memberService.registerMember(member);
        return ResponseEntity.ok(savedMember);
    }
}