package com.gym_system.PS_fitness.controller;

import com.gym_system.PS_fitness.model.Member;
import com.gym_system.PS_fitness.repository.MemberRepository;
import com.gym_system.PS_fitness.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.gym_system.PS_fitness.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final PdfService pdfService;

    @PutMapping("/{id}/renew")
    public ResponseEntity<Member> renewMembership(@PathVariable Long id) {
        Member renewedMember = memberService.renewMembership(id);
        return ResponseEntity.ok(renewedMember);
    }

    @GetMapping("/me")
    public ResponseEntity<Member> getCurrentMember(Principal principal) {
        Member member = memberService.getMemberByEmail(principal.getName());
        return ResponseEntity.ok(member);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @PutMapping("/admin/members/{id}/update-date")
    public ResponseEntity<Member> updatePaymentDate(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<Member> memberOpt = memberRepository.findById(id);
        if (memberOpt.isPresent()) {
            Member member = memberOpt.get();
            member.setNextPaymentDate(LocalDate.parse(request.get("nextPaymentDate")));
            memberRepository.save(member);
            return ResponseEntity.ok(member);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/receipt")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long id) {
        Optional<Member> memberOpt = memberRepository.findById(id);

        if (memberOpt.isPresent()) {
            Member member = memberOpt.get();
            byte[] pdfBytes = pdfService.generateReceipt(member);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            // "attachment" forces the browser to download the file instead of opening it
            headers.setContentDispositionFormData("attachment", "PS_Fitness_Receipt_" + member.getName() + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        }
        return ResponseEntity.notFound().build();
    }
}