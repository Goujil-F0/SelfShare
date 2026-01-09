package com.selfshare.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

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
                        .requestMatchers("/api/secrets", "/api/secrets/**", "/error", "/", "/vault.html", "/view.html", "/css/**", "/js/**", "/index.html/**").permitAll()

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
}