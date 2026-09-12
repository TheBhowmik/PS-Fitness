package com.gym_system.PS_fitness.repository;

import com.gym_system.PS_fitness.model.PaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, Long> {
    List<PaymentRecord> findByMemberIdOrderByPaymentDateDesc(Long memberId);
}