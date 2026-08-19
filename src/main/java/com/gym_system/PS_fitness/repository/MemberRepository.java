package com.gym_system.PS_fitness.repository;

import com.gym_system.PS_fitness.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    Optional<Member> findByPhone(String phone);

    // Custom query to find all members whose payment is due on a specific date
    List<Member> findByNextPaymentDate(LocalDate date);
}