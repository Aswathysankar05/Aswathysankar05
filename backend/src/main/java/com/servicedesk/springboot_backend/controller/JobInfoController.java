package com.servicedesk.springboot_backend.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.servicedesk.springboot_backend.entity.JobInfo;
import com.servicedesk.springboot_backend.service.JobInfoService;

@RestController
@RequestMapping("/api")
public class JobInfoController {

    @Autowired
    private JobInfoService jobInfoService;

    @GetMapping("/jobInfoes")
    public List<JobInfo> getJobs() {
        return jobInfoService.getAllJobs();
    }

}
