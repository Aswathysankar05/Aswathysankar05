package com.servicedesk.springboot_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.servicedesk.springboot_backend.entity.StatusInfo;
import com.servicedesk.springboot_backend.service.StatusInfoService;

@RestController
@RequestMapping("/api")
public class StatusInfoController {

    @Autowired
    private StatusInfoService statusInfoService;

    // @GetMapping("/statuses")
    @GetMapping("/statusInfoes")
    public List<StatusInfo> getStatuses() {
        return statusInfoService.getAllStatuses();
    }

    @GetMapping("/{statusId}")
    public ResponseEntity<StatusInfo> getStatusById(@PathVariable String statusId) {
        Optional<StatusInfo> statusInfo = statusInfoService.getStatusById(statusId);
        return statusInfo.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
