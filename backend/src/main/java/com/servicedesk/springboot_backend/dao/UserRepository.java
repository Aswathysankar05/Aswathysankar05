package com.servicedesk.springboot_backend.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.servicedesk.springboot_backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // User findByEmail(String email);
    Optional<User> findById(Long id);
}
