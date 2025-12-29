package com.selfshare.repository;

import com.selfshare.entity.Secret;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SecretRepository extends JpaRepository<Secret, String> {
    // Cette méthode permet de trouver les secrets dont la date d'expiration est passée
    List<Secret> findByExpiresAtBefore(LocalDateTime now);
}