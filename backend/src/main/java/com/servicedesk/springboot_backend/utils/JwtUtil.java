
package com.servicedesk.springboot_backend.utils;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtUtil {

    private String secretKey = "U2VjcmV0VGhhdFNob3VsZCByZXBvc2Uga2V5IGhlcmU=";
    // @Value("${app.jwt.secretKey}")
    // private String secretKey;
   
    public JwtUtil() {
        if (secretKey == null || secretKey.isEmpty()) {
            throw new IllegalArgumentException("Secret key must be set.");
        }
    }

    // Generate JWT token
    public String generateToken(String username) {
        // byte[] decodedKey = Decoders.BASE64.decode(secretKey);
        // Key key = Keys.hmacShaKeyFor(decodedKey);
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes()); 

        System.out.println("Tokennnnnnnnnnnnnnnnnnn key"+key);
        return Jwts.builder()
                .signWith(key)
                .subject(username)
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .issuedAt(new Date())
                .compact();
       
    }

     // Extract username from JWT Token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract any claim from JWT Token
    public <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
     // Extract all claims from the JWT token
    private Claims extractAllClaims(String token) {
        // byte[] decodedKey = Decoders.BASE64.decode(secretKey);
        // Key key = Keys.hmacShaKeyFor(decodedKey);
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes()); 
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Validate JWT Token
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

     // Validate if the token is correct
     public boolean validateToken(String token, String username) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));
    }
    // Validate token extracted from HttpServletRequest
    public boolean isValidToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer")) {

            String token = authorizationHeader.substring(6); // Extract token after "Bearer "
            String username = extractUsername(token); // Extract username from the token
            // Validate token using username and check expiration
            return validateToken(token, username);
        }
        return false; // Missing or improperly formatted token
    }
   
        
}
