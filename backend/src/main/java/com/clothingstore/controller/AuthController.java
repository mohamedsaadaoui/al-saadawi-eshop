package com.clothingstore.controller;

import com.clothingstore.config.JwtUtil;
import com.clothingstore.model.dto.AuthResponse;
import com.clothingstore.model.dto.LoginRequest;
import com.clothingstore.model.dto.RegisterRequest;
import com.clothingstore.model.entity.User;
import com.clothingstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().build();
        }

        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.ROLE_USER)
                .build();

        userRepository.save(user);

        // Auto login after register
        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwt)
                .role(user.getRole().name())
                .name(user.getFullName())
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        // Fetch user again to get details like role/name easily or cast UserDetails
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwt)
                .role(user.getRole().name())
                .name(user.getFullName())
                .build());
    }
}
