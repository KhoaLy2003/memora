package com.khoaly.memora.common.config;

import com.khoaly.memora.common.util.JwtUtils;
import com.khoaly.memora.feature.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Autowired
    public SecurityConfig(JwtUtils jwtUtils, UserRepository userRepository) {
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    @Bean
    public OAuth2SuccessHandler oauth2SuccessHandler() {
        return new OAuth2SuccessHandler(jwtUtils, userRepository, frontendUrl);
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthFilter() {
        return new JwtAuthenticationFilter(jwtUtils);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of(frontendUrl, frontendUrl.replace("://", "://www.")));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Accept-Language", "Origin", "X-Requested-With"));
                    config.setAllowCredentials(true);
                    config.setMaxAge(3600L); // Cache preflight for 1 hour
                    return config;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/v1/auth/**", "/v3/api-docs/**", "/swagger-ui/**",
                                "/login/**",
                                "/oauth2/**",
                                "/api/health",
                                "/error")
                        .permitAll()
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oauth2SuccessHandler()))
                .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
