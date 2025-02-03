package com.servicedesk.springboot_backend.service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.servicedesk.springboot_backend.dao.JobInfoRepository;
import com.servicedesk.springboot_backend.entity.JobInfo;

@Service
public class JobInfoService {

    @Autowired
    private JobInfoRepository jobInfoRepository;

    public List<JobInfo> getAllJobs() {
        return jobInfoRepository.findAll();
    }

    public Optional<JobInfo> getJobById(String job_id) {
        return jobInfoRepository.findById(job_id);
    }


}
