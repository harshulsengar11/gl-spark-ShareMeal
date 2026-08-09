package com.sharemeal.auth.exception;

import com.sharemeal.auth.dto.RegisterRequestDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<RegisterRequestDTO.ErrorResponseDTO> handleEmailAlreadyExists(
            EmailAlreadyExistsException ex) {

        RegisterRequestDTO.ErrorResponseDTO response = RegisterRequestDTO.ErrorResponseDTO.builder()
                .message(ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<RegisterRequestDTO.ErrorResponseDTO> handleUserNotFound(
            UserNotFoundException ex) {

        RegisterRequestDTO.ErrorResponseDTO response = RegisterRequestDTO.ErrorResponseDTO.builder()
                .message(ex.getMessage())
                .status(HttpStatus.NOT_FOUND.value())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<RegisterRequestDTO.ErrorResponseDTO> handleInvalidCredentials(
            InvalidCredentialsException ex) {

        RegisterRequestDTO.ErrorResponseDTO response = RegisterRequestDTO.ErrorResponseDTO.builder()
                .message(ex.getMessage())
                .status(HttpStatus.UNAUTHORIZED.value())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        ));

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<RegisterRequestDTO.ErrorResponseDTO> handleGenericException(
            Exception ex) {

        RegisterRequestDTO.ErrorResponseDTO response = RegisterRequestDTO.ErrorResponseDTO.builder()
                .message(ex.getMessage())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(
                response,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<RegisterRequestDTO.ErrorResponseDTO> handleInvalidRole(
            HttpMessageNotReadableException ex) {

        RegisterRequestDTO.ErrorResponseDTO response = RegisterRequestDTO.ErrorResponseDTO.builder()
                .message("Invalid role. Allowed roles: ADMIN, DONOR, NGO, CUSTOMER, VOLUNTEER")
                .status(HttpStatus.BAD_REQUEST.value())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<RegisterRequestDTO.ErrorResponseDTO>
    handleBadCredentials(BadCredentialsException ex) {

        RegisterRequestDTO.ErrorResponseDTO response =
                RegisterRequestDTO.ErrorResponseDTO.builder()
                        .message("Invalid email or password")
                        .status(HttpStatus.UNAUTHORIZED.value())
                        .timestamp(LocalDateTime.now())
                        .build();

        return new ResponseEntity<>(
                response,
                HttpStatus.UNAUTHORIZED
        );
    }


}