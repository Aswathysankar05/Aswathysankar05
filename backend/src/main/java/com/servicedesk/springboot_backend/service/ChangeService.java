package com.servicedesk.springboot_backend.service;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

import com.servicedesk.springboot_backend.dao.ChangeRepository;
import com.servicedesk.springboot_backend.dao.StatusInfoRepository;
import com.servicedesk.springboot_backend.entity.Change;
import com.servicedesk.springboot_backend.entity.StatusInfo;

@Service
public class ChangeService {

    @Autowired
    private ChangeRepository changeRepository;

    @Autowired
    private StatusInfoRepository statusInfoRepository;

    @Autowired
    private JavaMailSender mailSender;


    public List<Change> getAllChanges() {
        List<Change> changes = changeRepository.findAll();
        System.out.println(changes); 
        return changes;
    }

    public Optional<Change> findById(Long id) {
        return changeRepository.findById(id);
    }

    public Change updateChange(Long id, Change updatedChange) {
        return changeRepository.findById(id)
                .map(change -> {
                    Timestamp currenttime =Timestamp.valueOf(ZonedDateTime.now(ZoneId.of("Asia/Kolkata")).toLocalDateTime());
                    // Check if status_id is provided
                    if (updatedChange.getStatusInfo() == null ||
                    updatedChange.getStatusInfo().getStatus_id() == null) {
                            throw new IllegalArgumentException(
                                            "StatusInfo and status_id must be provided");
                    }
                    StatusInfo statusInfo = statusInfoRepository
                                    .findById(updatedChange.getStatusInfo().getStatus_id())
                                    .orElseThrow(() -> new ResourceNotFoundException(
                                                    "Status not found with id " + updatedChange
                                                                    .getStatusInfo()
                                                                    .getStatus_id()));
                    
                    change.setChng_summary(updatedChange.getChng_summary());
                    change.setChng_description(updatedChange.getChng_description());
                    change.setChng_priority(change.getChng_priority());
                    change.setContact_name(change.getContact_name());
                    change.setContact_email(change.getContact_email());
                    change.setAssignmentgroup(change.getAssignmentgroup());
                    change.setCreated_by(updatedChange.getCreated_by());
                    change.setCreated_at(updatedChange.getCreated_at());
                    change.setUpdated_at(currenttime);
                    change.setStatusInfo(statusInfo);
                    String preStatusId = change.getStatusInfo() != null ? change.getStatusInfo().getStatus_id() : null;
                    // Check if status is being updated to "Close"
                    // if ("2".equalsIgnoreCase(change.getStatusInfo().getStatus_id().toString()) &&
                    //         !"2".equalsIgnoreCase(preStatusId != null ? preStatusId.toString() : null)) {
                    //     System.out.println("Pleaseee set close date for your Change");
                    //     change.setClosed_at(
                    //             Timestamp.valueOf(ZonedDateTime.now(ZoneId.of("Asia/Kolkata")).toLocalDateTime()));
                    // } else {
                    //     System.out.println("closedddddddddddddddddddddddddddddddddddddddddddddd"+change.getClosed_at());
                    //     change.setClosed_at(change.getClosed_at());
                    // }
                    if ("2".equalsIgnoreCase(change.getStatusInfo().getStatus_id() != null ? change.getStatusInfo().getStatus_id().toString() : null)) {
                        change.setClosed_at(currenttime);
                    } else {
                        change.setClosed_at(null);
                    }
                    // return changeRepository.save(change);
                    Change savedChange = changeRepository.save(change);
                    UpdateEmailNotification(savedChange);
                    return savedChange;
                })
                .orElseThrow(() -> new ResourceNotFoundException("Change not found with id " + id));

    }

    private void UpdateEmailNotification(Change change) {
                // Email to the contact (user who created the incident)
                String contactEmailSubject = "CHNG" + change.getChng_id() + ": Your Service Desk Ticket Has Been Updated";
            
                String contactEmailBody = "<html><body style='font-family: Arial, sans-serif; color: #333;'>"
                        + "<div style='background-color: #f4f4f4; padding: 20px; border-radius: 8px;'>"
                        + "<h2 style='color: #2e6c8c;'>Your service desk ticket has been updated!</h2>"
                        + "<p>Your change has been updated. Please see the details below:</p>"
                        + "<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Change Request Number:</td><td style='padding: 8px;'>CHNG" + change.getChng_id() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Summary:</td><td style='padding: 8px;'>" + change.getChng_summary() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Description:</td><td style='padding: 8px;'>" + change.getChng_description() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Priority:</td><td style='padding: 8px;'>" + change.getChng_priority() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>" + change.getStatusInfo().getStatus_name() + "</td></tr>"
                        + "</table>"
                        + "<p style='margin-top: 20px;'>If you have any additional information or updates regarding the issue, please update your ticket directly through the portal https://servicedesk-dev.cloudplusinfotech.com/user-dashboard/viewtickets/userworkhistory/requests/"+change.getChng_id()+"</p>"
                        + "<p style='font-size: 12px; color: #777;'>This is an automated message. Please do not reply directly to this email.</p>"
                        + "</div>"
                        + "</body></html>";
            
                String contactEmail = change.getContact_email(); // The contact user's email
            
                // Send email to the contact (user who created the incident)
                SendEmail(contactEmail, contactEmailSubject, contactEmailBody);
            
                // Email to the assigned user (assigned to the incident)
                String assignedUserEmailSubject = "CHNG" + change.getChng_id() + ": A New Update Has Been Made to the Change Request Assigned to You";
            
                String assignedUserEmailBody = "<html><body style='font-family: Arial, sans-serif; color: #333;'>"
                        + "<div style='background-color: #f4f4f4; padding: 20px; border-radius: 8px;'>"
                        + "<h2 style='color: #2e6c8c;'>A new update has been made to the change request assigned to you!</h2>"
                        + "<p>An update has been made to the service desk change request assigned to you. Please see the details below:</p>"
                        + "<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Change Request Number:</td><td style='padding: 8px;'>CHNG" + change.getChng_id() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Summary:</td><td style='padding: 8px;'>" + change.getChng_summary() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Description:</td><td style='padding: 8px;'>" + change.getChng_description() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Priority:</td><td style='padding: 8px;'>" + change.getChng_priority() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>" + change.getStatusInfo().getStatus_name() + "</td></tr>"
                        + "</table>"
                        + "<p style='margin-top: 20px;'>Please review the request and take necessary action. You can update the status through the support portal https://servicedesk-dev.cloudplusinfotech.com/support-dashboard/supportviewtickets/supportworkhistory/requests/"+change.getChng_id()+"</p>"
                        + "<p style='font-size: 12px; color: #777;'>This is an automated message. Please do not reply directly to this email.</p>"
                        + "</div>"
                        + "</body></html>";
            
                String assignedUserEmail = change.getAssignmentgroup(); // The assigned user's email
            
                // Send email to the assigned user (incident assignee)
                SendEmail(assignedUserEmail, assignedUserEmailSubject, assignedUserEmailBody);
            }
            
            

    public long getChangeCount() {
        return changeRepository.countChanges(); 
    }

    
    public Change createChange(Change newchange) {
                Timestamp createdtime =Timestamp.valueOf(ZonedDateTime.now(ZoneId.of("Asia/Kolkata")).toLocalDateTime());
                // Fetch the status info from the repository using status_id
                StatusInfo statusInfo = statusInfoRepository.findById("1")
                        .orElseThrow(() -> new ResourceNotFoundException("Status not found with id 1"));

                // Set the status info to the Change
                newchange.setStatusInfo(statusInfo);

                newchange.setChng_summary(newchange.getChng_summary());
                newchange.setChng_description(newchange.getChng_description());
                newchange.setChng_priority(newchange.getChng_priority());
                newchange.setContact_name(newchange.getContact_name());
                newchange.setContact_email(newchange.getContact_email());
                newchange.setCreated_by(newchange.getCreated_by());
                newchange.setAssignmentgroup(newchange.getAssignmentgroup());
                newchange.setCreated_at(createdtime);
                newchange.setUpdated_at(createdtime);

                // return changeRepository.save(newchange);
                Change savedChange = changeRepository.save(newchange);
                sendEmailNotification(savedChange);
                return savedChange;
    }
    private void sendEmailNotification(Change change) {
                // Create an email message
                String contactEmailSubject = "CHNG"+change.getChng_id()+": Your Service Desk Ticket Has Been Created";
                
                String contactEmailBody = "<html><body style='font-family: Arial, sans-serif; color: #333;'>"
                + "<div style='background-color: #f4f4f4; padding: 20px; border-radius: 8px;'>"
                + "<h2 style='color: #2e6c8c;'>Thank you for reaching out to our support team!</h2>"
                + "<p>We have successfully received your request, and a service desk change request has been created.</p>"
                + "<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Incident Number:</td><td style='padding: 8px;'>CHNG" + change.getChng_id() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Summary:</td><td style='padding: 8px;'>" + change.getChng_summary() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Description:</td><td style='padding: 8px;'>" + change.getChng_description() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Priority:</td><td style='padding: 8px;'>" + change.getChng_priority() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>" + change.getStatusInfo().getStatus_name() + "</td></tr>"
                + "</table>"
                + "<p style='margin-top: 20px;'>Our support team will review your ticket and get back to you as soon as possible. In the meantime, you can track the status of your request through our support portal at https://servicedesk-dev.cloudplusinfotech.com/.</p>"
                + "<p>If you have any additional information or updates regarding the issue, please update your ticket directly through the portal.</p>"
                + "<p style='font-size: 12px; color: #777;'>This is an automated message. Please do not reply directly to this email.</p>"
                + "</div>"
                + "</body></html>";
                    
                String contactEmail = change.getContact_email(); 

                // Send email to the contact (user who created the incident)
                SendEmail(contactEmail, contactEmailSubject, contactEmailBody);

                // Email to the assigned user (assigned to the incident)
                String assignedUserEmailSubject = "CHNG" + change.getChng_id() + ": A New Change Request Has Been Assigned To You";
        
                String assignedUserEmailBody = "<html><body style='font-family: Arial, sans-serif; color: #333;'>"
                + "<div style='background-color: #f4f4f4; padding: 20px; border-radius: 8px;'>"
                + "<h2 style='color: #2e6c8c;'>A new change request has been assigned to you!</h2>"
                + "<p>You have been assigned a new service desk change request. Please review the details below:</p>"
                + "<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Change Request Number:</td><td style='padding: 8px;'>CHNG" + change.getChng_id() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Summary:</td><td style='padding: 8px;'>" + change.getChng_summary() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Description:</td><td style='padding: 8px;'>" + change.getChng_description() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Priority:</td><td style='padding: 8px;'>" + change.getChng_priority() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>" + change.getStatusInfo().getStatus_name() + "</td></tr>"
                + "</table>"
                + "<p style='margin-top: 20px;'>Please take a moment to review the change request and take necessary action. You can update the status through the support portal.</p>"
                + "<p style='font-size: 12px; color: #777;'>This is an automated message. Please do not reply directly to this email.</p>"
                + "</div>"
                + "</body></html>";
        
                String assignedUserEmail = change.getAssignmentgroup(); // The assigned user's email
                
                // Send email to the assigned user (incident assignee)
                SendEmail(assignedUserEmail, assignedUserEmailSubject, assignedUserEmailBody);
                
    }

    // Helper method to send emails
    private void SendEmail(String to, String subject, String body) {
        MimeMessagePreparator preparator = mimeMessage -> {
        MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true, "utf-8");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body, true);
        message.setFrom("aswathysankar777@gmail.com", "Cloudplus Service Desk");
        };
            
        try {
        mailSender.send(preparator);
        } catch (Exception e) {
        e.printStackTrace();
        }
    }

public long getChangeCountByStatusId(String statusId) {
    return changeRepository.countByStatusId(statusId);
}

public long getCriticalTicketCount() {
    return changeRepository.countCriticalTickets();
}


}
