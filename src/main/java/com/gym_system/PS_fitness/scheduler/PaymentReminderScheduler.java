package com.gym_system.PS_fitness.scheduler;

import com.gym_system.PS_fitness.model.Member;
import com.gym_system.PS_fitness.repository.MemberRepository;
import com.gym_system.PS_fitness.service.EmailService;
import com.gym_system.PS_fitness.service.SmsService;
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
    private final SmsService smsService;

    // For testing purposes, this cron expression runs EVERY MINUTE.
    // In production, you would change this to run once a day (e.g., "0 0 9 * * ?")
    @Scheduled(cron = "0 * * * * ?")
    public void checkAndSendReminders() {
        System.out.println("Checking for upcoming payments...");

        // Find members whose payment is due in exactly 3 days
        LocalDate targetDate = LocalDate.now().plusDays(3);
        List<Member> dueMembers = memberRepository.findByNextPaymentDate(targetDate);

        if (dueMembers.isEmpty()) {
            System.out.println("No payments due on " + targetDate);
            return;
        }

        // Loop through the results and send the mock notifications
        for (Member member : dueMembers) {
            String emailBody = "Hi " + member.getName() + ", your gym membership fee for PS Fitness is due on " + member.getNextPaymentDate() + ".";
            String smsBody = "PS Fitness Alert: Membership fee due in 3 days on " + member.getNextPaymentDate();

            emailService.sendEmail(member.getEmail(), "PS Fitness Membership Due Reminder", emailBody);
            smsService.sendSms(member.getPhone(), smsBody);
        }
    }
}