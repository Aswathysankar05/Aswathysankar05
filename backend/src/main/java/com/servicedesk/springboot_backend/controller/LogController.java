package com.servicedesk.springboot_backend.controller;
import com.servicedesk.springboot_backend.entity.LogMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/logs")
public class LogController {
      
    private static final Logger logger = LoggerFactory.getLogger(LogController.class);
    
    // POST endpoint to receive log messages
    @PostMapping
    public ResponseEntity<String> receiveLog(@RequestBody LogMessage logMessage) {
        String logEntry = String.format("%s [%s] - %s", LocalDateTime.now(), logMessage.getLevel(), logMessage.getMessage());
        
        // Log to file
        logToFile(logEntry);
        
        // Also log to console using SLF4J
        logger.info(logEntry);

        return ResponseEntity.ok("Log saved successfully");
    }

    // Helper method to append log to a file
    private void logToFile(String logEntry) {
        try (FileWriter fw = new FileWriter("logs/service-desk-backend.log", true);
             PrintWriter pw = new PrintWriter(fw)) {
            pw.println(logEntry);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}