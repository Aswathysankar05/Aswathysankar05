package com.servicedesk.springboot_backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.servicedesk.springboot_backend.entity.JobInfo;

public interface JobInfoRepository extends JpaRepository<JobInfo, String> {

}
