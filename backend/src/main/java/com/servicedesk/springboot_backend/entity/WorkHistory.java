package com.servicedesk.springboot_backend.entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "work_history")
@Data
public class WorkHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "workid")
    private Long workid;

    @Column(name = "work_summary")
    private String work_summary;

    @Column(name = "action_performed")
    private String action_performed;

    @Column(name = "work_description")
    private String work_description;

    @Column(name = "performed_by")
    private String performed_by;

    @Column(name = "timestamp")
    private Timestamp timestamp;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getWorkid() {
        return workid;
    }

    public void setWorkid(Long workid) {
        this.workid = workid;
    }

    public String getWork_summary() {
        return work_summary;
    }

    public void setWork_summary(String work_summary) {
        this.work_summary = work_summary;
    }

    public String getAction_performed() {
        return action_performed;
    }

    public void setAction_performed(String action_performed) {
        this.action_performed = action_performed;
    }

    public String getWork_description() {
        return work_description;
    }

    public void setWork_description(String work_description) {
        this.work_description = work_description;
    }

    public String getPerformed_by() {
        return performed_by;
    }

    public void setPerformed_by(String performed_by) {
        this.performed_by = performed_by;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) { // Accept Timestamp
        this.timestamp = timestamp;
    }

}
