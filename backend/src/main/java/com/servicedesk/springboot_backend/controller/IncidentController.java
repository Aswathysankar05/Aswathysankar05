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

import com.servicedesk.springboot_backend.entity.Incident;
import com.servicedesk.springboot_backend.service.IncidentService;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    @Autowired
    private IncidentService incidentService;

    @GetMapping
    public List<Incident> getAllIncidents() {
        return incidentService.getAllIncidents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incident> getIncidentById(@PathVariable Long id) {
        Optional<Incident> incident = incidentService.findById(id);
        if (incident.isPresent()) {
            return ResponseEntity.ok(incident.get());
        } else {
            return ResponseEntity.notFound().build(); // Return 404 if not found
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Incident> updateIncident(@PathVariable Long id,
            @RequestBody Incident updatedIncident) {
        Incident updated = incidentService.updateIncident(id, updatedIncident);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/count")
    public long getIncidentCount() {
        return incidentService.getIncidentCount();
    }
    
    @PostMapping
    public Incident createIncident(@RequestBody Incident incident) {
        return incidentService.createIncident(incident);
    }

    @GetMapping("/active-count")
    public ResponseEntity<Long> getIncidentCountByStatusId(@RequestParam String statusId) {
        long count = incidentService.getIncidentCountByStatusId(statusId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/critical-count")
    public ResponseEntity<Long> getCriticalTicketCount() {
        long count = incidentService.getCriticalTicketCount();
        return ResponseEntity.ok(count);
    }
}