package com.gym_system.PS_fitness.service;

import com.gym_system.PS_fitness.model.Member;
import com.gym_system.PS_fitness.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public Member registerMember(Member member) {
        member.setJoiningDate(LocalDate.now());
        member.setNextPaymentDate(LocalDate.now().plusMonths(1));
        return memberRepository.save(member);
    }

    public Member renewMembership(Long memberId) {
        // 1. Find the member by ID, or throw an error if they don't exist
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + memberId));

        // 2. Add exactly 1 month to their CURRENT due date
        member.setNextPaymentDate(member.getNextPaymentDate().plusMonths(1));

        // 3. Save the updated member back to PostgreSQL
        return memberRepository.save(member);
    }
}