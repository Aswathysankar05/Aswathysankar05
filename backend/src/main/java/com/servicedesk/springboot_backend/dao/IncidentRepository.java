package com.servicedesk.springboot_backend.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.servicedesk.springboot_backend.entity.Incident;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    Optional<Incident> findById(Long id);

    // Custom query to count incidents
    @Query("SELECT COUNT(i) FROM Incident i")
    long countIncidents();

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.statusInfo.status_id = :statusId")
    long countByStatusId(@Param("statusId") String statusId);
    
    @Query("SELECT COUNT(i) FROM Incident i WHERE i.inc_priority IN ('P1')")
    long countCriticalTickets();
}
