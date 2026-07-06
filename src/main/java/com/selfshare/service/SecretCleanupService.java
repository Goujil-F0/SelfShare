package com.selfshare.service;

import com.selfshare.entity.AuditLog;
import com.selfshare.entity.Secret;
import com.selfshare.repository.AuditLogRepository;
import com.selfshare.repository.SecretRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SecretCleanupService {

    private static final Logger log = LoggerFactory.getLogger(SecretCleanupService.class);

    @Autowired
    private SecretRepository secretRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Scheduled(fixedRate = 60000)
    public void deleteExpiredSecrets() {
        log.info("Checking expired secrets...");

        List<Secret> expiredSecrets = secretRepository.findByExpiresAtBefore(LocalDateTime.now());

        for (Secret secret : expiredSecrets) {
            String secretId = secret.getId();

            secretRepository.delete(secret);
            log.info("System: secret {} deleted after expiration", secretId);

            auditLogRepository.save(new AuditLog("EXPIRED", secretId));

            if (secret.getSenderEmail() != null && !secret.getSenderEmail().isEmpty()) {
                emailService.sendSimpleEmail(
                        secret.getSenderEmail(),
                        "SelfShare: votre secret a ete supprime",
                        "Le delai de validite est depasse. Votre secret a ete efface pour votre securite."
                );
            }
        }
    }
}
