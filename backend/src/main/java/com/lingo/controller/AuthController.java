package com.lingo.controller;

import com.lingo.dto.Dto;
import com.lingo.config.JwtService;
import com.lingo.repo.UserRepository;
import com.lingo.repo.UserRepository.UserRow;
import jakarta.validation.Valid;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Dto.AuthResponse register(@Valid @RequestBody Dto.RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        try {
            UserRow u = users.create(email, encoder.encode(req.password()), req.displayName().trim());
            return respond(u);
        } catch (DuplicateKeyException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã được đăng ký");
        }
    }

    @PostMapping("/login")
    public Dto.AuthResponse login(@Valid @RequestBody Dto.LoginRequest req) {
        UserRow u = users.findByEmail(req.email().trim().toLowerCase())
                .filter(x -> encoder.matches(req.password(), x.passwordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không đúng"));
        return respond(u);
    }

    private Dto.AuthResponse respond(UserRow u) {
        return new Dto.AuthResponse(jwt.issue(u.id(), u.email(), u.role()), u.email(), u.displayName());
    }
}
