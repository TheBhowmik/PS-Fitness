package com.gym_system.PS_fitness.controller;

import com.gym_system.PS_fitness.model.Member;
import com.gym_system.PS_fitness.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PutMapping("/{id}/renew")
    public ResponseEntity<Member> renewMembership(@PathVariable Long id) {
        Member renewedMember = memberService.renewMembership(id);
        return ResponseEntity.ok(renewedMember);
    }

    @GetMapping("/me")
    public ResponseEntity<Member> getCurrentMember(Principal principal) {
        // principal.getName() contains the email from the JWT
        Member member = memberService.getMemberByEmail(principal.getName());
        return ResponseEntity.ok(member);
    }

    @GetMapping("/all")
    public ResponseEntity<java.util.List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }
}