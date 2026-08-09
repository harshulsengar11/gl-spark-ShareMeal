package com.sharemeal.auth.service;

import com.sharemeal.auth.dto.AuthResponseDTO;
import com.sharemeal.auth.dto.LoginRequestDTO;
import com.sharemeal.auth.dto.RegisterRequestDTO;
import com.sharemeal.auth.dto.UserResponseDTO;

import java.util.List;

public interface AuthService {

    UserResponseDTO register(RegisterRequestDTO requestDTO);

    UserResponseDTO getUserById(Long id);

    List<UserResponseDTO> getAllUsers();

    AuthResponseDTO login(LoginRequestDTO requestDTO);

    UserResponseDTO updateUser(Long id, RegisterRequestDTO requestDTO);

    void deleteUser(Long id);

    UserResponseDTO getProfile(String email);

    UserResponseDTO updateProfile(String email, RegisterRequestDTO requestDTO);

    UserResponseDTO getUserByEmail(String email);
}