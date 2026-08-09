package com.sharemeal.auth.service;

import com.sharemeal.auth.dto.AuthResponseDTO;
import com.sharemeal.auth.dto.LoginRequestDTO;
import com.sharemeal.auth.dto.RegisterRequestDTO;
import com.sharemeal.auth.dto.UserResponseDTO;
import com.sharemeal.auth.entity.User;
import com.sharemeal.auth.exception.EmailAlreadyExistsException;
import com.sharemeal.auth.exception.UserNotFoundException;
import com.sharemeal.auth.repository.UserRepository;
import com.sharemeal.auth.security.JwtService;
import com.sharemeal.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    @Override
    public UserResponseDTO register(RegisterRequestDTO requestDTO) {

        if (userRepository.existsByEmail(requestDTO.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "Email already registered"
            );
        }

        User user = User.builder()
                .fullName(requestDTO.getFullName())
                .email(requestDTO.getEmail())
                .password(passwordEncoder.encode(requestDTO.getPassword()))
                .phoneNumber(requestDTO.getPhoneNumber())
                .role(requestDTO.getRole())
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }

    @Override
    public UserResponseDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id : " + id
                        ));

        return mapToResponse(user);
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private UserResponseDTO mapToResponse(User user) {

        return UserResponseDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    public AuthResponseDTO login(
            LoginRequestDTO requestDTO) {

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(
                        requestDTO.getEmail(),
                        requestDTO.getPassword()
                )
        );

        User user = userRepository
                .findByEmail(requestDTO.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found"
                        ));

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return AuthResponseDTO.builder()
                .token(token)
                .message("Login successful")
                .build();
    }

    @Override
    public UserResponseDTO updateUser(
            Long id,
            RegisterRequestDTO requestDTO) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id : " + id
                        ));

        if (!user.getEmail().equals(requestDTO.getEmail())
                && userRepository.existsByEmail(requestDTO.getEmail())) {

            throw new EmailAlreadyExistsException(
                    "Email already registered"
            );
        }

        user.setFullName(requestDTO.getFullName());
        user.setEmail(requestDTO.getEmail());
        user.setPassword(
                passwordEncoder.encode(
                        requestDTO.getPassword()
                )
        );
        user.setPhoneNumber(requestDTO.getPhoneNumber());
        user.setRole(requestDTO.getRole());

        User updatedUser =
                userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id : " + id
                        ));

        userRepository.delete(user);
    }

    @Override
    public UserResponseDTO getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found"
                        ));

        return mapToResponse(user);
    }

    @Override
    public UserResponseDTO updateProfile(
            String email,
            RegisterRequestDTO requestDTO) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found"
                        ));

        user.setFullName(requestDTO.getFullName());

        if (!user.getEmail().equals(requestDTO.getEmail())
                && userRepository.existsByEmail(requestDTO.getEmail())) {

            throw new EmailAlreadyExistsException(
                    "Email already registered"
            );
        }

        user.setEmail(requestDTO.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        requestDTO.getPassword()
                )
        );

        user.setPhoneNumber(requestDTO.getPhoneNumber());

        user.setRole(requestDTO.getRole());

        return mapToResponse(
                userRepository.save(user)
        );
    }

    @Override
    public UserResponseDTO getUserByEmail(
            String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found"
                        ));

        return mapToResponse(user);
    }
}