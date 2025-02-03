package com.servicedesk.springboot_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.servicedesk.springboot_backend.dao.StatusInfoRepository;
import com.servicedesk.springboot_backend.entity.StatusInfo;

@Service
public class StatusInfoService {

    @Autowired
    private StatusInfoRepository statusInfoRepository;

    public List<StatusInfo> getAllStatuses() {
        return statusInfoRepository.findAll();
    }

    public Optional<StatusInfo> getStatusById(String statusId) {
        return statusInfoRepository.findById(statusId);
    }

}
