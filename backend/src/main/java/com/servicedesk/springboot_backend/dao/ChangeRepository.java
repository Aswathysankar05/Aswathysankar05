package com.servicedesk.springboot_backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.servicedesk.springboot_backend.entity.Change;

public interface ChangeRepository extends JpaRepository<Change, Long> {

    @Query("SELECT COUNT(i) FROM Change i")
    long countChanges();

    @Query("SELECT COUNT(i) FROM Change i WHERE i.statusInfo.status_id = :statusId")
    long countByStatusId(@Param("statusId") String statusId);
    
    @Query("SELECT COUNT(i) FROM Change i WHERE i.chng_priority IN ('P1')")
    long countCriticalTickets();
}
