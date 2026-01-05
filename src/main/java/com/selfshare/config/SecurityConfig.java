package com.selfshare.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Toujours désactivé pour faciliter les tests API/Postman
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/secrets/**").permitAll() // TOUT LE MONDE peut créer/lire des secrets
                        .requestMatchers("/admin/**").hasRole("ADMIN")  // SEUL l'admin peut voir le dashboard
                        .anyRequest().authenticated()
                )
                .formLogin(withDefaults()) // Active le formulaire de login pour la partie admin
                .httpBasic(withDefaults()); // Permet aussi de tester via Postman

        return http.build();
    }

    // Création d'un utilisateur admin temporaire (en mémoire)
    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        UserDetails admin = User.withDefaultPasswordEncoder()
                .username("admin")
                .password("admin123")
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(admin);
    }
}