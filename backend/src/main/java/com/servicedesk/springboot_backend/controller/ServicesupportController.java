package com.servicedesk.springboot_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.servicedesk.springboot_backend.entity.Servicesupport;
import com.servicedesk.springboot_backend.service.SupportService;

// we need to update the api call with springboot keyword, review this
@RestController
@RequestMapping("/api")
public class ServicesupportController {

    @Autowired
    private SupportService supportService;

    @GetMapping("/servicesupports")
    public ResponseEntity<List<Servicesupport>> getServicesupports() {
        List<Servicesupport> servicesupports = supportService.getAllServicesupports();
        return ResponseEntity.ok(servicesupports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servicesupport> getServiceSupportsById(@PathVariable Long id) {
        Servicesupport servicesupports = supportService.getServicesupportsById(id);
        return ResponseEntity.ok(servicesupports);

    }

}
