package com.servicedesk.springboot_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.servicedesk.springboot_backend.entity.WorkHistory;
import com.servicedesk.springboot_backend.service.WorkHistoryService;

@RestController
@RequestMapping("/api/workhistory")
public class WorkHistoryController {
    @Autowired
    private WorkHistoryService workHistoryService;

    @GetMapping
    public List<WorkHistory> getAllWorkHistorys() {
        return workHistoryService.getAllWorkHistorys();
    }
    @GetMapping("/{workid}")
    public List<WorkHistory> getWorkHistoryByWorkid(@PathVariable Long workid) {
        return workHistoryService.findByWorkid(workid);
    }

    // @GetMapping("/{workid}")
    // public ResponseEntity<WorkHistory> getWorkHistoryByWorkid(@PathVariable Long workid) {
    //     Optional<WorkHistory> workhistory = workHistoryService.findByWorkid(workid);
    //     if (workhistory.isPresent()) {
    //         return ResponseEntity.ok(workhistory.get());
    //     } else {
    //         return ResponseEntity.notFound().build(); // Return 404 if not found
    //     }
    // }

    @PostMapping
    public ResponseEntity<WorkHistory> addWorkHistory(@RequestBody WorkHistory newWorkHistory) {
       System.out.println("newWorkHistoryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"+newWorkHistory.getTimestamp());
        // Validate incoming data if necessary
        if (newWorkHistory.getWork_summary() == null ||
                newWorkHistory.getWork_description() == null ||
                newWorkHistory.getWorkid() == null ||
                newWorkHistory.getPerformed_by() == null) {
            return ResponseEntity.badRequest().build(); // Return 400 if required fields are missing
        }
        WorkHistory created = workHistoryService.addWorkHistory(newWorkHistory);
        //System.out.println("createddddddddddddddddddddddddddd"+created);
        return ResponseEntity.status(201).body(created); // 201 Created
    }

    

}
