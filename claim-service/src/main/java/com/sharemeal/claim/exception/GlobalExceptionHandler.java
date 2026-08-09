package com.sharemeal.claim.exception;

import com.sharemeal.claim.dto.ErrorResponseDTO;
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

    @ExceptionHandler(ClaimNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO>
    handleClaimNotFound(
            ClaimNotFoundException ex) {

        return new ResponseEntity<>(

                ErrorResponseDTO.builder()
                        .message(ex.getMessage())
                        .status(404)
                        .timestamp(LocalDateTime.now())
                        .build(),

                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(FoodAlreadyClaimedException.class)
    public ResponseEntity<ErrorResponseDTO>
    handleFoodAlreadyClaimed(
            FoodAlreadyClaimedException ex) {

        return new ResponseEntity<>(

                ErrorResponseDTO.builder()
                        .message(ex.getMessage())
                        .status(400)
                        .timestamp(LocalDateTime.now())
                        .build(),

                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(InvalidRatingException.class)
    public ResponseEntity<ErrorResponseDTO>
    handleInvalidRating(
            InvalidRatingException ex) {

        return new ResponseEntity<>(

                ErrorResponseDTO.builder()
                        .message(ex.getMessage())
                        .status(400)
                        .timestamp(LocalDateTime.now())
                        .build(),

                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>>
    handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String,String> errors =
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

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO>
    handleException(
            Exception ex) {

        return new ResponseEntity<>(

                ErrorResponseDTO.builder()
                        .message(ex.getMessage())
                        .status(500)
                        .timestamp(LocalDateTime.now())
                        .build(),

                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}