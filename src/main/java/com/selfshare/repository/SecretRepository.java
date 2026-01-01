package com.selfshare.repository;

import com.selfshare.entity.Secret;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecretRepository extends JpaRepository<Secret, String> {
    // Cette interface vide suffit à faire tout le travail (Save, Find, Delete)
}