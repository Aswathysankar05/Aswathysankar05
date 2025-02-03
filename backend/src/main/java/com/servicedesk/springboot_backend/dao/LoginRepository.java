package com.servicedesk.springboot_backend.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.servicedesk.springboot_backend.entity.Login;

public interface LoginRepository extends JpaRepository<Login, Long> {

    Login findByEmail(String email);

    // Method to fetch all login records
    List<Login> findAll();
    List<Login> findByUserType(String userType);
}
