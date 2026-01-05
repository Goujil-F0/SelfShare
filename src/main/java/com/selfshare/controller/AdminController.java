package com.selfshare.controller;

import com.selfshare.entity.AuditLog;
import com.selfshare.repository.AuditLogRepository;
import com.selfshare.repository.SecretRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin") // Toutes les routes ici commenceront par /api/admin
public class AdminController {

    @Autowired
    private SecretRepository secretRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    // 1. Récupérer le nombre total de secrets actuellement en base
    @GetMapping("/stats/count")
    public long getActiveSecretsCount() {
        return secretRepository.count();
    }

    // 2. Récupérer tout l'historique des logs (pour le tableau de l'étudiant D)
    @GetMapping("/logs")
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    // 3. Optionnel : Une stat pour savoir combien de secrets ont été créés au total
    @GetMapping("/stats/total-created")
    public long getTotalCreated() {
        // On compte combien de fois l'événement "CREATED" apparaît dans les logs
        return auditLogRepository.findAll().stream()
                .filter(log -> "CREATED".equals(log.getEventType()))
                .count();
    }
}