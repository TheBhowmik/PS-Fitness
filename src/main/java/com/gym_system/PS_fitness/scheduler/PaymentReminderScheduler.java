package com.gym_system.PS_fitness.scheduler;

import com.gym_system.PS_fitness.model.Member;
import com.gym_system.PS_fitness.repository.MemberRepository;
import com.gym_system.PS_fitness.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PaymentReminderScheduler {

    private final MemberRepository memberRepository;
    private final EmailService emailService;

    // Runs every day at 8:00 AM server time
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendUpcomingPaymentReminders() {
        LocalDate targetDate = LocalDate.now().plusDays(3);
        List<Member> membersDueSoon = memberRepository.findByNextPaymentDate(targetDate);

        for (Member member : membersDueSoon) {
            emailService.sendPaymentReminder(
                    member.getEmail(),
                    member.getName(),
                    member.getNextPaymentDate().toString()
            );
            System.out.println("Reminder sent to: " + member.getEmail());
        }
    }
}