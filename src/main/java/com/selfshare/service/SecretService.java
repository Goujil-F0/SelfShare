package com.selfshare.service;

import com.selfshare.entity.Secret;
import com.selfshare.entity.AuditLog;
import com.selfshare.repository.SecretRepository;
import com.selfshare.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class SecretService {

    @Autowired
    private SecretRepository secretRepository;

    @Autowired
    private AuditLogRepository auditLogRepository; // Injecte le nouveau repo

    // Sauvegarder le secret (Le texte ou fichier chiffré envoyé par le front)
    public Secret saveSecret(Secret secret) {
        Secret saved = secretRepository.save(secret);
        // On enregistre l'action dans l'audit
        auditLogRepository.save(new AuditLog("CREATED", saved.getId()));
        return saved;
    }

    // Récupérer et SUPPRIMER immédiatement
    public Optional<Secret> getAndDestroySecret(String id) {
        Optional<Secret> secret = secretRepository.findById(id);
        if (secret.isPresent()) {
            secretRepository.deleteById(id);
            // On enregistre l'action dans l'audit
            auditLogRepository.save(new AuditLog("DELETED_BY_USER", id));
        }
        return secret;
    }
}