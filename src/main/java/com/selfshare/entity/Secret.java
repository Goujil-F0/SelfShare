package com.selfshare.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "secrets")
public class Secret {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] contentBlob;

    private String filename;
    private boolean isFile;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime expiresAt;
    private String senderEmail;
    private String iv;

    // Constructeurs
    public Secret() {}

    // Getters et Setters (Tu peux les générer avec Alt+Insert)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public byte[] getContentBlob() { return contentBlob; }
    public void setContentBlob(byte[] contentBlob) { this.contentBlob = contentBlob; }
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    public boolean isFile() { return isFile; }
    public void setFile(boolean file) { isFile = file; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }
    public String getIv() { return iv; }
    public void setIv(String iv) { this.iv = iv; }
}
