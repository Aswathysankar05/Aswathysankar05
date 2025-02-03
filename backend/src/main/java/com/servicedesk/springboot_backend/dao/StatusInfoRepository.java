package com.servicedesk.springboot_backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.servicedesk.springboot_backend.entity.StatusInfo;

public interface StatusInfoRepository extends JpaRepository<StatusInfo, String> {

}
