package com.servicedesk.springboot_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.servicedesk.springboot_backend.dao.LoginRepository;
import com.servicedesk.springboot_backend.entity.Login;
import com.servicedesk.springboot_backend.entity.LoginRequest;
import com.servicedesk.springboot_backend.service.CaptchaService;
import com.servicedesk.springboot_backend.service.LoginService;
import com.servicedesk.springboot_backend.utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private CaptchaService captchaService;

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private LoginService loginService;


    // @PostMapping("/logins")
    // public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

    //     Login user = loginRepository.findByEmail(loginRequest.getEmail());

    //     // Verify CAPTCHA first
    //     String captchaResponse = loginRequest.getCaptchaResponse();
    //     boolean isCaptchaValid = captchaService.verifyCaptcha(captchaResponse);

    //     if (!isCaptchaValid) {

    //         return ResponseEntity.status(400).body("CAPTCHA validation failed.");
    //     }
    //     if (user != null && user.getPswd().equals(loginRequest.getPswd())) {
    //         String role = user.getUserType();
    //         String useremail = user.getEmail();
    //         return ResponseEntity.ok().body(new ApiResponse(true, "Login successful", role, useremail));
    //     } else {
    //         return ResponseEntity.badRequest()
    //                 .body(new ApiResponse(false, "Invalid email or password", "false", "null"));
    //     }
    // }

    // public static class ApiResponse {
    //     public final boolean success;
    //     public final String message;
    //     public final String role;
    //     public final String useremail;

    //     public ApiResponse(boolean success, String message, String role, String useremail) {
    //         this.success = success;
    //         this.message = message;
    //         this.role = role;
    //         this.useremail = useremail;
    //     }
    // }

    // @GetMapping("/loginusers")
    // public ResponseEntity<List<Login>> getAllLogins() {
    //     List<Login> logins = loginRepository.findAll();
    //     return ResponseEntity.ok(logins);
    // }

  @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/logins")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        Login user = loginRepository.findByEmail(loginRequest.getEmail());
        // Verify CAPTCHA first
        String captchaResponse = loginRequest.getCaptchaResponse();
        boolean isCaptchaValid = captchaService.verifyCaptcha(captchaResponse);
         if (!isCaptchaValid) {
            return ResponseEntity.status(400).body("CAPTCHA validation failed.");
        }
        if (user != null && user.getPswd().equals(loginRequest.getPswd())) {
            String role = user.getUserType();
            String useremail = user.getEmail();
            String token = jwtUtil.generateToken(useremail);
            String username = jwtUtil.extractUsername(token);

			return ResponseEntity.ok().body(new ApiResponse(true, "Login successful", role, useremail, token));
        } else {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid email or password", "false", "null", "null"));
        }
    }

    public static class ApiResponse {
        public final boolean success;
        public final String message;
        public final String role;
        public final String useremail;
        public final String token;

        public ApiResponse(boolean success, String message, String role, String useremail, String token) {
            this.success = success;
            this.message = message;
            this.role = role;
            this.useremail = useremail;
            this.token = token;
        }
    }

    // JWT token validation for /loginusers and /supportusers
    @GetMapping("/loginusers")
    public ResponseEntity<List<Login>> getAllLogins(HttpServletRequest request) {
        if (!jwtUtil.isValidToken(request)) {
            return ResponseEntity.status(401).build(); // Return 401 if token is invalid
        }

        List<Login> logins = loginRepository.findAll();
        return ResponseEntity.ok(logins);
    }



    @PostMapping("/loginusers")
    public Login createLogin(@RequestBody Login login) {
        return loginService.createLogin(login);
    }

    @GetMapping("/supportusers")
    public ResponseEntity<List<Login>> getSupportUsers() {
        List<Login> supportUsers = loginRepository.findByUserType("Support");
        return ResponseEntity.ok(supportUsers);
    }

}