package com.selfshare.service;

import com.selfshare.entity.AuditLog;
import com.selfshare.entity.Secret;
import com.selfshare.repository.AuditLogRepository;
import com.selfshare.repository.SecretRepository;
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
    private SecretRepository secretRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuditLogRepository auditLogRepository; // AJOUT : Pour enregistrer l'action dans l'audit

    // Cette tâche se lance toutes les minutes
    @Scheduled(fixedRate = 60000)
    public void deleteExpiredSecrets() {
        log.info("Vérification des secrets expirés...");

        // On récupère la liste des secrets dont la date d'expiration est passée
        List<Secret> expiredSecrets = secretRepository.findByExpiresAtBefore(LocalDateTime.now());

        for (Secret secret : expiredSecrets) {
            String secretId = secret.getId();

            // 1. Suppression du secret en base de données
            secretRepository.delete(secret);
            log.info("Système : Secret {} supprimé (date d'expiration atteinte)", secretId);

            // 2. AJOUT : Enregistrement dans la table audit_logs pour le Dashboard (Personne D)
            auditLogRepository.save(new AuditLog("EXPIRED", secretId));

            // 3. Notification par email si un expéditeur était renseigné
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