package com.coveragex.todobackend.service;

import com.coveragex.todobackend.dto.AuthRequest;
import com.coveragex.todobackend.dto.AuthResponse;
import com.coveragex.todobackend.dto.RegisterRequest;
import com.coveragex.todobackend.entity.User;
import com.coveragex.todobackend.repository.UserRepository;
import com.coveragex.todobackend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for handling authentication operations
 * @Transactional ensures database consistency
 * @RequiredArgsConstructor generates constructor for final fields (Lombok)
 * @Slf4j provides logging capability
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    /**
     * Register a new user
     * @param registerRequest registration details
     * @return authentication response with JWT token
     * @throws RuntimeException if username or email already exists
     */
    public AuthResponse register(RegisterRequest registerRequest) {
        log.info("Attempting to register user: {}", registerRequest.getUsername());

        // Check if username already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));

        // Save user to database
        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getUsername());

        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getUsername());

        return new AuthResponse(token, savedUser.getUsername(), savedUser.getEmail());
    }

    /**
     * Authenticate user login
     * @param authRequest login credentials
     * @return authentication response with JWT token
     * @throws BadCredentialsException if credentials are invalid
     */
    public AuthResponse login(AuthRequest authRequest) {
        log.info("Attempting to authenticate user: {}", authRequest.getUsername());

        try {
            // Authenticate using Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(),
                            authRequest.getPassword()
                    )
            );

            // Get user details
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername());

            log.info("User authenticated successfully: {}", user.getUsername());
            return new AuthResponse(token, user.getUsername(), user.getEmail());

        } catch (BadCredentialsException e) {
            log.error("Authentication failed for user: {}", authRequest.getUsername());
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    /**
     * Validate JWT token and get user details
     * @param token JWT token
     * @return user details if token is valid
     */
    public User validateTokenAndGetUser(String token) {
        String username = jwtUtil.extractUsername(token);
        if (username != null && jwtUtil.validateToken(token, username)) {
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("Invalid token");
    }
}