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
        // Automatically set the joining date to today
        member.setJoiningDate(LocalDate.now());

        // Use plusMonths(1) to keep the exact same day of the month
        member.setNextPaymentDate(LocalDate.now().plusMonths(1));

        return memberRepository.save(member);
    }
}