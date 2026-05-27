package com.portfolio.service;

import com.portfolio.model.ContactMessage;
import com.portfolio.repository.ContactMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactMessageRepository repository;
    private final EmailService emailService;

    public ContactService(ContactMessageRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    /**
     * Save a new contact message from the portfolio contact form
     * and send a notification email asynchronously.
     */
    public ContactMessage saveMessage(ContactMessage message) {
        ContactMessage saved = repository.save(message);
        try {
            emailService.sendContactNotification(saved);
        } catch (Exception e) {
            // Email failure is non-blocking — message is already saved to DB.
            log.warn("Email notification skipped: {}", e.getMessage());
        }
        return saved;
    }

    /**
     * Retrieve all messages ordered by most recent first.
     */
    public List<ContactMessage> getAllMessages() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Get unread messages count.
     */
    public long getUnreadCount() {
        return repository.countByRead(false);
    }

    /**
     * Mark a message as read.
     */
    public ContactMessage markAsRead(Long id) {
        ContactMessage message = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + id));
        message.setRead(true);
        return repository.save(message);
    }
}
