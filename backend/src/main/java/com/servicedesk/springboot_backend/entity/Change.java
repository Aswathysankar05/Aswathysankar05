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
@Table(name = "changereq")
@Data

public class Change {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chng_id")
    private Long chng_id;

    @Column(name = "chng_summary")
    private String chng_summary;

    @Column(name = "chng_priority")
    private String chng_priority;

    @Column(name = "chng_description")
    private String chng_description;

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
    public Long getChng_id() {
        return chng_id;
    }

    public void setChng_id(Long chng_id) {
        this.chng_id = chng_id;
    }

    public String getChng_summary() {
        return chng_summary;
    }

    public void setChng_summary(String chng_summary) {
        this.chng_summary = chng_summary;
    }

    public String getChng_description() {
        return chng_description;
    }

    public void setChng_description(String chng_description) {
        this.chng_description = chng_description;
    }

    public String getChng_priority() {
        return chng_priority;
    }

    public void setChng_priority(String chng_priority) {
        this.chng_priority = chng_priority;
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

    public void setUpdated_at(Timestamp updated_at) { // Accept Timestamp
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
