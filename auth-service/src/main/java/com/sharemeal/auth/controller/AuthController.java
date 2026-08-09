package com.sharemeal.auth.controller;

import com.sharemeal.auth.dto.AuthResponseDTO;
import com.sharemeal.auth.dto.LoginRequestDTO;
import com.sharemeal.auth.dto.RegisterRequestDTO;
import com.sharemeal.auth.dto.UserResponseDTO;
import com.sharemeal.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(
            @Valid @RequestBody RegisterRequestDTO requestDTO) {

        UserResponseDTO response =
                authService.register(requestDTO);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody
            LoginRequestDTO requestDTO) {

        return ResponseEntity.ok(
                authService.login(requestDTO)
        );
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {

        return ResponseEntity.ok(
                authService.getAllUsers()
        );
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                authService.getUserById(id)
        );
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody RegisterRequestDTO requestDTO) {

        return ResponseEntity.ok(
                authService.updateUser(id, requestDTO)
        );
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {

        authService.deleteUser(id);

        return ResponseEntity.ok(
                "User deleted successfully"
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDTO> getProfile(
            Authentication authentication) {

        return ResponseEntity.ok(
                authService.getProfile(
                        authentication.getName()
                )
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponseDTO> updateProfile(
            Authentication authentication,
            @Valid @RequestBody RegisterRequestDTO requestDTO) {

        return ResponseEntity.ok(
                authService.updateProfile(
                        authentication.getName(),
                        requestDTO
                )
        );
    }

    @GetMapping("/internal/user/{email}")
    public ResponseEntity<UserResponseDTO>
    getUserByEmail(
            @PathVariable String email) {

        return ResponseEntity.ok(
                authService.getUserByEmail(email)
        );
    }
}