package com.servicedesk.springboot_backend.entity;

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
@Table(name = "login_info")
@Data
public class Login {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long user_id;

    @Column(name = "fullname")
    private String fullname;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false) 
    private JobInfo jobInfo;

    @Column(name = "email")
    private String email;

    @Column(name = "phonenumber")
    private String phonenumber;

    @Column(name = "pswd")
    private String pswd;

    @Column(name = "pswdcnfrm")
    private String pswdcnfrm;

    @Column(name = "user_type")
    private String userType;

    @Column(name = "user_status")
    private String user_status;

    //  private String captchaResponse;

    // Getters and setters
    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

   
    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public String getPswd() {
        return pswd;
    }

    public void setPswd(String pswd) {
        this.pswd = pswd;
    }

    public String getPswdCnfrm() {
        return pswdcnfrm;
    }

    public void setPswdCnfrm(String pswdcnfrm) {
        this.pswdcnfrm = pswdcnfrm;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getUser_Status() {
        return user_status;
    }

    public void setUser_Status(String user_status) {
        this.user_status = user_status;
    }
    // public String getCaptchaResponse() {
    //     return captchaResponse;
    // }

    // public void setCaptchaResponse(String captchaResponse) {
    //     this.captchaResponse = captchaResponse;
    // }

}
