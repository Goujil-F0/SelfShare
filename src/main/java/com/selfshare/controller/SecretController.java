package com.selfshare.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.selfshare.entity.Secret;
import com.selfshare.service.SecretService;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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

    @GetMapping("/test")
    public String testPublic() {
        return "L'API est bien publique !";
    }

    @GetMapping(value = "/qr/{id}", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getQRCode(@PathVariable String id, @RequestParam("baseUrl") String baseUrl) throws Exception {
        // On utilise l'adresse envoyée par le navigateur (localhost ou ngrok)
        // On s'assure que l'URL pointe vers la page de vue
        String urlToEncode = baseUrl + "/view.html?id=" + id;

        // Debug pour voir dans ta console ce qui est écrit dans le QR Code
        System.out.println("Génération QR Code pour l'URL : " + urlToEncode);

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(urlToEncode, BarcodeFormat.QR_CODE, 300, 300);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);

        return pngOutputStream.toByteArray();
    }
}