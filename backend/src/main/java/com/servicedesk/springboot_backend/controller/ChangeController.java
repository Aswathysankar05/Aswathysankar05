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

import com.servicedesk.springboot_backend.entity.Change;
import com.servicedesk.springboot_backend.service.ChangeService;

@RestController
@RequestMapping("/api/changes")
public class ChangeController {
    @Autowired
    private ChangeService changeService;

    @GetMapping
    public List<Change> getAllChanges() {
        return changeService.getAllChanges();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Change> getChangeById(@PathVariable Long id) {
        Optional<Change> change = changeService.findById(id);
        if (change.isPresent()) {
            return ResponseEntity.ok(change.get());
        } else {
            return ResponseEntity.notFound().build(); // Return 404 if not found
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Change> updateChange(@PathVariable Long id,
            @RequestBody Change updatedChange) {
        Change updated = changeService.updateChange(id, updatedChange);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/count")
    public long getChangeCount() {
        return changeService.getChangeCount();
    }

    @PostMapping
    public Change createChange(@RequestBody Change change) {
        return changeService.createChange(change);
    }

    @GetMapping("/active-count")
    public ResponseEntity<Long> getChangeCountByStatusId(@RequestParam String statusId) {
        long count = changeService.getChangeCountByStatusId(statusId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/critical-count")
    public ResponseEntity<Long> getCriticalTicketCount() {
        long count = changeService.getCriticalTicketCount();
        return ResponseEntity.ok(count);
    }

}
