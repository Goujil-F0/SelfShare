package com.selfshare.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eventType; // "CREATED", "DELETED_BY_USER", "EXPIRED"
    private String secretId;  // L'ID du secret concerné
    private LocalDateTime eventDate = LocalDateTime.now();

    // Constructeurs
    public AuditLog() {}

    public AuditLog(String eventType, String secretId) {
        this.eventType = eventType;
        this.secretId = secretId;
        this.eventDate = LocalDateTime.now();
    }

    // Getters et Setters
    public Long getId() { return id; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getSecretId() { return secretId; }
    public void setSecretId(String secretId) { this.secretId = secretId; }
    public LocalDateTime getEventDate() { return eventDate; }
}