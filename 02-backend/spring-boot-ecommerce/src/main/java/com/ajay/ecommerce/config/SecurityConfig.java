package com.ajay.ecommerce.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
@Bean
  public PasswordEncoder passwordEncoder(){
  return new BCryptPasswordEncoder();
}

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable()) // Disable CSRF if your frontend handles it
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/**").permitAll() // Public endpoints
            .anyRequest().authenticated() // All other endpoints require authentication
        )
        .exceptionHandling(exception -> exception
            .authenticationEntryPoint((request, response, authException) -> {
              // Send 401 Unauthorized instead of redirecting
              response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            })
        )
        .logout(logout -> logout.disable()); // Optional: Disable default logout handling

    return http.build();
  }
}
