package com.selfshare.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class FileService {

    // Cette fonction transforme un fichier envoyé par le navigateur en "octets" pour la base de données
    public byte[] convertToBytes(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        return file.getBytes(); // C'est ici que la magie opère
    }
}