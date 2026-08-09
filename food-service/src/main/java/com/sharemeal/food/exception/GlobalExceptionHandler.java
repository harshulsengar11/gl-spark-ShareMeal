package com.sharemeal.food.exception;

import com.sharemeal.food.dto.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FoodNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO>
    handleFoodNotFound(
            FoodNotFoundException ex) {

        return new ResponseEntity<>(

                ErrorResponseDTO.builder()
                        .message(ex.getMessage())
                        .status(HttpStatus.NOT_FOUND.value())
                        .timestamp(LocalDateTime.now())
                        .build(),

                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponseDTO>
    handleUnauthorized(
            UnauthorizedException ex) {

        return new ResponseEntity<>(

                ErrorResponseDTO.builder()
                        .message(ex.getMessage())
                        .status(HttpStatus.UNAUTHORIZED.value())
                        .timestamp(LocalDateTime.now())
                        .build(),

                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>>
    handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors =
                new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        ));

        return new ResponseEntity<>(
                errors,
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>>
    handleIllegalArgumentException(
            IllegalArgumentException ex) {

        Map<String, Object> response =
                new HashMap<>();

        response.put("message",
                ex.getMessage());

        response.put("status", 400);

        response.put("timestamp",
                LocalDateTime.now());

        return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST
        );
    }
}