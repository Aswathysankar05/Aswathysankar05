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
@Table(name = "incident")
@Data

public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inc_id")
    private Long inc_id;

    @Column(name = "inc_summary")
    private String inc_summary;

    @Column(name = "inc_priority")
    private String inc_priority;

    @Column(name = "inc_description")
    private String inc_description;

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

    // @Column(name = "status_id")
    // private String status_id;

    // Add a relationship to the StatusInfo
    @ManyToOne
    @JoinColumn(name = "status_id", nullable = false) // Make sure your incident table has a status_id column
    private StatusInfo statusInfo;

    // Getters and setters
    public Long getInc_id() {
        return inc_id;
    }

    public void setInc_id(Long inc_id) {
        this.inc_id = inc_id;
    }

    public String getInc_summary() {
        return inc_summary;
    }

    public void setInc_summary(String inc_summary) {
        this.inc_summary = inc_summary;
    }

    public String getInc_description() {
        return inc_description;
    }

    public void setInc_description(String inc_description) {
        this.inc_description = inc_description;
    }

    public String getInc_priority() {
        return inc_priority;
    }

    public void setInc_priority(String inc_priority) {
        this.inc_priority = inc_priority;
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

}
