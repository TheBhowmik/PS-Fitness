package com.gym_system.PS_fitness.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPaymentReminder(String toEmail, String memberName, String dueDate) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("PS Fitness - Upcoming Membership Renewal");

            String htmlContent = "<div style='font-family: sans-serif; padding: 20px; background-color: #111827; color: #f3f4f6; border-radius: 10px;'>"
                    + "<h2 style='color: #ef4444;'>PS Fitness Notice</h2>"
                    + "<p>Hello <b>" + memberName + "</b>,</p>"
                    + "<p>This is a friendly reminder that your gym membership is set to renew in 3 days on <b>" + dueDate + "</b>.</p>"
                    + "<p>Please log in to your dashboard to complete your payment and maintain access to the facility.</p>"
                    + "<br><p>Stay strong,<br>The PS Fitness Team</p>"
                    + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Failed to send email to " + toEmail);
        }
    }
}