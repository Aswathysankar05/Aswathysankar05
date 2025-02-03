package com.servicedesk.springboot_backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.servicedesk.springboot_backend.entity.Servicesupport;

public interface ServicesupportRepository extends JpaRepository<Servicesupport, Long> {

}
