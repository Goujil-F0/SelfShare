package com.selfshare.service;

import com.selfshare.entity.Secret;
import com.selfshare.repository.SecretRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class SecretService {

    @Autowired
    private SecretRepository secretRepository;

    // Sauvegarder le secret (Le texte ou fichier chiffré envoyé par le front)
    public Secret saveSecret(Secret secret) {
        return secretRepository.save(secret);
    }

    // Récupérer et SUPPRIMER immédiatement
    public Optional<Secret> getAndDestroySecret(String id) {
        Optional<Secret> secret = secretRepository.findById(id);

        if (secret.isPresent()) {
            secretRepository.deleteById(id); // Suppression définitive de la BDD
            System.out.println("Secret " + id + " a été consulté et détruit.");
        }

        return secret;
    }
}