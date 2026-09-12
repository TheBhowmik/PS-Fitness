package com.gym_system.PS_fitness.service;

import com.gym_system.PS_fitness.model.Member;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;

@Service
public class PdfService {

    public byte[] generateReceipt(Member member) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, java.awt.Color.BLACK);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 12, java.awt.Color.DARK_GRAY);

            // Header
            Paragraph title = new Paragraph("PS Fitness - Payment Receipt", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(30);
            document.add(title);

            // Member Details
            document.add(new Paragraph("Member Name: " + member.getName(), bodyFont));
            document.add(new Paragraph("Email Address: " + member.getEmail(), bodyFont));
            document.add(new Paragraph("Phone Number: " + member.getPhone(), bodyFont));
            document.add(new Paragraph(" ", bodyFont)); // Spacer

            // Payment Details
            document.add(new Paragraph("Date of Payment: " + LocalDate.now().toString(), bodyFont));
            document.add(new Paragraph("Amount Paid: INR 500.00", bodyFont));
            document.add(new Paragraph("Next Due Date: " + member.getNextPaymentDate().toString(), bodyFont));

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF receipt", e);
        }
    }
}