package com.servicedesk.springboot_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.servicedesk.springboot_backend.entity.Request;
import com.servicedesk.springboot_backend.service.RequestService;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @GetMapping
    public List<Request> getAllRequests() {
        return requestService.getAllRequests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Request> getRequestById(@PathVariable Long id) {
        Optional<Request> request = requestService.findById(id);
        if (request.isPresent()) {
            return ResponseEntity.ok(request.get());
        } else {
            return ResponseEntity.notFound().build(); // Return 404 if not found
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Request> updateRequest(@PathVariable Long id,
            @RequestBody Request updatedRequest) {
        System.out.println("updateeeeeeeeeeeeeeeeeeee requesttttttttttttttttttttttttttttttttttt");
        Request updated = requestService.updateRequest(id, updatedRequest);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/count")
    public long getRequestCount() {
        return requestService.getRequestCount();
    }

    @PostMapping
    public Request createRequest(@RequestBody Request request) {
        return requestService.createRequest(request);
    }

    @GetMapping("/active-count")
    public ResponseEntity<Long> getRequestCountByStatusId(@RequestParam String statusId) {
        long count = requestService.getRequestCountByStatusId(statusId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/critical-count")
    public ResponseEntity<Long> getCriticalTicketCount() {
        long count = requestService.getCriticalTicketCount();
        return ResponseEntity.ok(count);
    }

}
