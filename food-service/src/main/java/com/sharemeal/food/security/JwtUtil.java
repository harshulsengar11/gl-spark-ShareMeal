package com.sharemeal.food.security;

import com.sharemeal.food.exception.UnauthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

/**
 * Reads the authenticated user's email straight out of the JWT that the
 * frontend attaches to every request. The API gateway forwards the
 * Authorization header through unchanged, so this service can trust and
 * decode it itself using the same signing key as auth-service.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret-key}")
    private String secretKey;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /**
     * Extracts the caller's email (the JWT subject) from an
     * "Authorization: Bearer <token>" header value.
     * Throws UnauthorizedException if the header is missing or the token
     * is invalid/expired.
     */
    public String extractEmail(String authorizationHeader) {

        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            throw new UnauthorizedException(
                    "Missing or invalid Authorization header"
            );
        }

        String token = authorizationHeader.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getSubject();

        } catch (JwtException | IllegalArgumentException e) {
            throw new UnauthorizedException(
                    "Invalid or expired token"
            );
        }
    }
}
