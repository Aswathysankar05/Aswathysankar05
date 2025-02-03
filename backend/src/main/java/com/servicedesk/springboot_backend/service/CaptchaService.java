package com.servicedesk.springboot_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class CaptchaService {

    @Value("${recaptcha.secret.key}")
    private String recaptchaSecretKey;

    private final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean verifyCaptcha(String captchaResponse) {
        RestTemplate restTemplate = new RestTemplate();
        
        String url = VERIFY_URL + "?secret=" + recaptchaSecretKey + "&response=" + captchaResponse;
        try {
            String response = restTemplate.postForObject(url, null, String.class);
            // The response should include success status
            return response.contains("\"success\": true");
        } catch (HttpClientErrorException e) {
            e.printStackTrace();
            return false;
        }
    }
}

