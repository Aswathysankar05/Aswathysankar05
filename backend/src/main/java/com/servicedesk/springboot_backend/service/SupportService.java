package com.servicedesk.springboot_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.servicedesk.springboot_backend.dao.ServicesupportRepository;
import com.servicedesk.springboot_backend.entity.Servicesupport;

@Service
public class SupportService {

    @Autowired
    private ServicesupportRepository servicesupportRepository;

    public List<Servicesupport> getAllServicesupports() {
        return servicesupportRepository.findAll();
    }

    public Servicesupport getServicesupportsById(Long id) {
        return servicesupportRepository.findById(id).orElse(null);
    }
}
