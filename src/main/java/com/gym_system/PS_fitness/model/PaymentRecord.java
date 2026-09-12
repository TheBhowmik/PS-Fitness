package com.gym_system.PS_fitness.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "payment_records")
@Data
public class PaymentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    @JsonIgnore // Prevents JSON infinite recursion errors
    private Member member;

    private Double amount;
    private LocalDate paymentDate;
    private String paymentMode; // e.g., "CASH" or "ONLINE"
}