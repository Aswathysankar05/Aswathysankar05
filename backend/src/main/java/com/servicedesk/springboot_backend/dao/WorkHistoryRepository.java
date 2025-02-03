package com.servicedesk.springboot_backend.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.servicedesk.springboot_backend.entity.WorkHistory;

public interface WorkHistoryRepository extends JpaRepository<WorkHistory, Long> {

    // Optional<WorkHistory> findByWorkid(Long workid);
    List<WorkHistory> findByWorkid(Long workid);
}