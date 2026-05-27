package com.portfolio.service;

import com.portfolio.model.ContactMessage;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Handles email notifications when a visitor submits the contact form.
 * Uses JavaMailSender with Gmail SMTP configured via environment variables.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${portfolio.email.recipient}")
    private String recipientEmail;

    @Value("${portfolio.email.sender}")
    private String senderEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Send a notification email when someone submits the contact form.
     * Runs asynchronously so the API response isn't blocked by SMTP latency.
     */
    @Async
    public void sendContactNotification(ContactMessage contactMessage) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(recipientEmail);
            helper.setSubject("📬 Portfolio Contact: " + sanitize(contactMessage.getSubject() != null
                    ? contactMessage.getSubject()
                    : "New message from " + contactMessage.getName()));

            String emailBody = buildEmailBody(contactMessage);
            helper.setText(emailBody, true);

            mailSender.send(message);
            log.info("Contact notification sent for message from: {}", contactMessage.getEmail());
        } catch (MailException | MessagingException e) {
            log.error("Failed to send contact notification email: {}", e.getMessage());
            // Don't throw — we don't want to fail the API request if email is down.
            // The message is already saved to the database regardless.
        }
    }

    /**
     * Build a rich HTML email body for the contact notification.
     */
    private String buildEmailBody(ContactMessage msg) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 20px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
                                <!-- Header -->
                                <tr>
                                    <td style="background:linear-gradient(135deg,#667eea,#764ba2);padding:32px 40px;text-align:center;">
                                        <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">📬 New Contact Message</h1>
                                        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Someone submitted the portfolio contact form</p>
                                    </td>
                                </tr>
                                <!-- Body -->
                                <tr>
                                    <td style="padding:32px 40px;">
                                        <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:8px 0;">
                                                    <strong style="color:#555;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Name</strong>
                                                    <p style="margin:4px 0 0;font-size:16px;color:#333;">%s</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;">
                                                    <strong style="color:#555;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Email</strong>
                                                    <p style="margin:4px 0 0;font-size:16px;color:#333;">
                                                        <a href="mailto:%s" style="color:#667eea;text-decoration:none;">%s</a>
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;">
                                                    <strong style="color:#555;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Subject</strong>
                                                    <p style="margin:4px 0 0;font-size:16px;color:#333;">%s</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;">
                                                    <strong style="color:#555;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Message</strong>
                                                    <blockquote style="margin:8px 0 0;padding:16px 20px;background-color:#f8f9fa;border-left:4px solid #667eea;border-radius:4px;font-size:15px;color:#444;line-height:1.6;white-space:pre-wrap;">%s</blockquote>
                                                </td>
                                            </tr>
                                        </table>
                                        <!-- Reply button -->
                                        <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                                            <tr>
                                                <td align="center">
                                                    <a href="mailto:%s?subject=Re:%%20%s"
                                                       style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#667eea,#764ba2);color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">
                                                        ✉️ Reply to %s
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color:#f8f9fa;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
                                        <p style="margin:0;font-size:12px;color:#999;">
                                            Sent from <strong>Suraj Dobale's Portfolio</strong> &middot;
                                            <a href="https://suryadob.github.io/resume-porfolio" style="color:#667eea;text-decoration:none;">suryadob.github.io/resume-porfolio</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(
                    sanitize(msg.getName()),
                    sanitize(msg.getEmail()), sanitize(msg.getEmail()),
                    sanitize(msg.getSubject() != null ? msg.getSubject() : "(No subject)"),
                    sanitize(msg.getMessage()),
                    sanitize(msg.getEmail()),
                    sanitize(msg.getSubject() != null ? msg.getSubject().replace(" ", "%20") : "Portfolio%20Inquiry"),
                    sanitize(msg.getName())
            );
    }

    /**
     * Sanitize user input to prevent HTML injection in emails.
     */
    private String sanitize(String input) {
        if (input == null) return "";
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;");
    }
}
