package com.servicedesk.springboot_backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.servicedesk.springboot_backend.entity.Request;

public interface RequestRepository extends JpaRepository<Request, Long> {

    @Query("SELECT COUNT(i) FROM Request i")
    long countRequests();

    @Query("SELECT COUNT(i) FROM Request i WHERE i.statusInfo.status_id = :statusId")
    long countByStatusId(@Param("statusId") String statusId);
    
    @Query("SELECT COUNT(i) FROM Request i WHERE i.req_priority IN ('P1')")
    long countCriticalTickets();
}
