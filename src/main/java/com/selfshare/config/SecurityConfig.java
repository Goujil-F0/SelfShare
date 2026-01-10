package com.selfshare.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.http.MediaType;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.ByteArrayOutputStream;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("DEBUG: Le fichier SecurityConfig est bien chargé par Spring !");
        http
                .csrf(csrf -> csrf.disable()) // Désactive CSRF pour faciliter les tests API
                .authorizeHttpRequests(auth -> auth
                        // Accès PUBLIC : création, lecture de secrets et fichiers statiques
                 
                        .requestMatchers(
                                "/api/secrets",
                                "/api/secrets/**",
                                "/error",
                                "/",
                                "/vault.html",
                                "/index.html",
                                "/view.html",
                                "/css/**",
                                "/js/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/api/secrets/qr"
                                ).permitAll()


                        // Accès RÉSERVÉ : Tout ce qui commence par /admin
                        .requestMatchers("/admin/**", "/api/admin/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .formLogin(withDefaults()) // Affiche le formulaire de login par défaut
                .logout(logout -> logout.logoutSuccessUrl("/")); // Redirige vers l'accueil après déconnexion

        return http.build();
    }

    // Création de l'utilisateur Admin en mémoire
    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        UserDetails admin = User.withDefaultPasswordEncoder()
                .username("admin")
                .password("admin123") // À changer plus tard pour plus de sécurité
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(admin);
    }

    @GetMapping(value = "/qr/{id}", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getQRCode(@PathVariable String id, HttpServletRequest request) throws Exception {
        // 1. On détecte l'adresse actuelle (localhost ou Ngrok)
        String scheme = request.getScheme(); // http ou https
        String serverName = request.getServerName(); // localhost ou ton-lien.ngrok-free.dev
        int serverPort = request.getServerPort();

        String baseUrl = scheme + "://" + serverName;
        if (serverPort != 80 && serverPort != 443) {
            baseUrl += ":" + serverPort;
        }

        // 2. On construit le lien secret que le téléphone va ouvrir
        String urlToEncode = baseUrl + "/view.html?id=" + id;

        // 3. On génère l'image QR Code
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(urlToEncode, BarcodeFormat.QR_CODE, 300, 300);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);

        return pngOutputStream.toByteArray();
    }
}