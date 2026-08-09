package com.sharemeal.notification.exception;

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

    @ExceptionHandler(
            NotificationNotFoundException.class
    )
    public ResponseEntity<Map<String,Object>>
    handleNotificationNotFound(
            NotificationNotFoundException ex) {

        Map<String,Object> response =
                new HashMap<>();

        response.put(
                "message",
                ex.getMessage()
        );

        response.put(
                "timestamp",
                LocalDateTime.now()
        );

        return new ResponseEntity<>(
                response,
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
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
    public ResponseEntity<Map<String,Object>>
    handleGenericException(
            Exception ex) {

        Map<String,Object> response =
                new HashMap<>();

        response.put(
                "message",
                ex.getMessage()
        );

        response.put(
                "timestamp",
                LocalDateTime.now()
        );

        return new ResponseEntity<>(
                response,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}