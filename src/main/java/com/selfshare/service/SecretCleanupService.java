package com.selfshare.service;

import com.selfshare.repository.SecretRepository;
import com.selfshare.entity.Secret;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class SecretCleanupService {

    @Autowired
    private SecretRepository secretRepository; // On utilise l'interface créée juste avant

    @Autowired
    private EmailService emailService; // On utilise ton service d'email

    // Cette tâche se lance toutes les minutes
    @Scheduled(fixedRate = 60000)
    public void deleteExpiredSecrets() {
        log.info("Vérification des secrets expirés...");

        List<Secret> expiredSecrets = secretRepository.findByExpiresAtBefore(LocalDateTime.now());

        for (Secret secret : expiredSecrets) {
            // 1. Suppression
            secretRepository.delete(secret);
            log.info("Système : Secret {} supprimé (date d'expiration atteinte)", secret.getId());

            // 2. Notification (on utilise le champ senderEmail que la Personne A a créé)
            if (secret.getSenderEmail() != null && !secret.getSenderEmail().isEmpty()) {
                emailService.sendSimpleEmail(
                        secret.getSenderEmail(),
                        "SelfShare : Votre secret a été supprimé",
                        "Le délai de validité est dépassé. Votre secret a été effacé pour votre sécurité."
                );
            }
        }
    }
}