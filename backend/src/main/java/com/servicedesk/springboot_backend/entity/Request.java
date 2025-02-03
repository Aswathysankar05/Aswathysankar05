package com.servicedesk.springboot_backend.entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "request")
@Data
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "req_id")
    private Long req_id;

    @Column(name = "req_summary")
    private String req_summary;

    @Column(name = "req_priority")
    private String req_priority;

    @Column(name = "req_description")
    private String req_description;

    @Column(name = "contact_name")
    private String contact_name;

    @Column(name = "contact_email")
    private String contact_email;

    @Column(name = "created_by")
    private String created_by;

    @Column(name = "created_at")
    //private String created_at;
    private Timestamp created_at;

    @Column(name = "updated_at")
    // private String updated_at;
    private Timestamp updated_at;

    @Column(name = "closed_at")
    // private String closed_at;
    private Timestamp closed_at;

    @Column(name = "assignmentgroup")
    private String assignmentgroup;

    // @Column(name = "status")
    // private String status;

    // Add a relationship to the StatusInfo
    @ManyToOne
    @JoinColumn(name = "status_id", nullable = false) // Make sure your incident table has a status_id column
    private StatusInfo statusInfo;

    // Getters and setters
    public Long getReq_id() {
        return req_id;
    }

    public void setReq_id(Long req_id) {
        this.req_id = req_id;
    }

    public String getReq_summary() {
        return req_summary;
    }

    public void setReq_summary(String req_summary) {
        this.req_summary = req_summary;
    }

    public String getReq_description() {
        return req_description;
    }

    public void setReq_description(String req_description) {
        this.req_description = req_description;
    }
    public String getReq_priority() {
        return req_priority;
    }

    public void setReq_priority(String req_priority) {
        this.req_priority = req_priority;
    }
    public String getContact_name() {
        return contact_name;
    }

    public void setContact_name(String contact_name) {
        this.contact_name = contact_name;
    }

    public String getContact_email() {
        return contact_email;
    }

    public void setContact_email(String contact_email) {
        this.contact_email = contact_email;
    }

    public String getCreated_by() {
        return created_by;
    }

    public void setCreated_by(String created_by) {
        this.created_by = created_by;
    }

    public Timestamp getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }

    public Timestamp getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(Timestamp updated_at) {
        this.updated_at = updated_at;
    }

    public Timestamp getClosed_at() {
        return closed_at;
    }

    public void setClosed_at(Timestamp closed_at) {
        this.closed_at = closed_at;
    }

    public String getAssignmentgroup() {
        return assignmentgroup;
    }

    public void setAssignmentgroup(String assignmentgroup) {
        this.assignmentgroup = assignmentgroup;
    }

    // public String getStatus() {
    // return status;
    // }

    // public void setStatus(String status) {
    // this.status = status;
    // }

}
