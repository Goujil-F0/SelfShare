package com.selfshare.controller;

import com.selfshare.entity.Secret;
import com.selfshare.service.SecretService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/secrets")
@CrossOrigin(origins = "*") // TRÈS IMPORTANT : permet au Frontend de parler au Backend
public class SecretController {

    @Autowired
    private SecretService secretService;

    // Endpoint pour CRÉER un secret (POST)
    @PostMapping
    public ResponseEntity<Secret> createSecret(@RequestBody Secret secret) {
        try {
            Secret savedSecret = secretService.saveSecret(secret);
            return ResponseEntity.ok(savedSecret);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Endpoint pour RÉCUPÉRER un secret par son ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Secret> getSecret(@PathVariable String id) {
        return secretService.getAndDestroySecret(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}