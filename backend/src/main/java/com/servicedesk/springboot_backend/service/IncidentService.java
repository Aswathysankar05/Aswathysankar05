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

import com.servicedesk.springboot_backend.dao.IncidentRepository;
import com.servicedesk.springboot_backend.dao.StatusInfoRepository;
import com.servicedesk.springboot_backend.entity.Incident;
import com.servicedesk.springboot_backend.entity.StatusInfo;


@Service
public class IncidentService {

        @Autowired
        private IncidentRepository incidentRepository;

        @Autowired
        private StatusInfoRepository statusInfoRepository;
        
        @Autowired
        private JavaMailSender mailSender;

        public List<Incident> getAllIncidents() {
                List<Incident> incidents = incidentRepository.findAll();                                      
                System.out.println(incidents); // Log the incidents to check their structure
                return incidents;
        }

        public Optional<Incident> findById(Long id) {
                return incidentRepository.findById(id);
        }

        public Incident updateIncident(Long id, Incident updatedIncident) {
                return incidentRepository.findById(id)
                                .map(incident -> {
                                        System.out.println("incidentttttttttttttttt updateeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                                        Timestamp currenttime =Timestamp.valueOf(ZonedDateTime.now(ZoneId.of("Asia/Kolkata")).toLocalDateTime());
                                        // Check if status_id is provided
                                        if (updatedIncident.getStatusInfo() == null ||
                                                        updatedIncident.getStatusInfo().getStatus_id() == null) {
                                                throw new IllegalArgumentException(
                                                                "StatusInfo and status_id must be provided");
                                        }
                                        StatusInfo statusInfo = statusInfoRepository
                                                        .findById(updatedIncident.getStatusInfo().getStatus_id())
                                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                                        "Status not found with id " + updatedIncident
                                                                                        .getStatusInfo()
                                                                                        .getStatus_id()));
                                        incident.setInc_summary(updatedIncident.getInc_summary());
                                        incident.setInc_priority(updatedIncident.getInc_priority());
                                        incident.setInc_description(updatedIncident.getInc_description());
                                        incident.setContact_name(updatedIncident.getContact_name());
                                        incident.setContact_email(updatedIncident.getContact_email());
                                        incident.setCreated_by(updatedIncident.getCreated_by());
                                        incident.setCreated_at(updatedIncident.getCreated_at());
                                        incident.setUpdated_at(currenttime);
                                        incident.setAssignmentgroup(updatedIncident.getAssignmentgroup());
                                        // Set the found StatusInfo
                                        incident.setStatusInfo(statusInfo);
                                        // Check if status has changed to "closed"
                                        String preStatusId = incident.getStatusInfo() != null
                                                        ? incident.getStatusInfo().getStatus_id()
                                                        : null;
                                        // if ("2".equalsIgnoreCase(incident.getStatusInfo().getStatus_id().toString()) &&
                                        //                 !"2".equalsIgnoreCase(
                                        //                                 preStatusId != null ? preStatusId.toString()
                                        //                                                 : null)) {
                                        //         incident.setClosed_at(
                                        //                         Timestamp.valueOf(ZonedDateTime
                                        //                                         .now(ZoneId.of("Asia/Kolkata"))
                                        //                                         .toLocalDateTime()));
                                        // } else {
                                        //         System.out.println("closedddddddddddddddddddddddddddddddddddddddddddddd"+incident.getClosed_at());
                                        //         incident.setClosed_at(incident.getClosed_at());
                                        // }
                                        if ("2".equalsIgnoreCase(incident.getStatusInfo().getStatus_id() != null ? incident.getStatusInfo().getStatus_id().toString() : null)) {
                                                incident.setClosed_at(currenttime);
                                        } else {
                                                System.out.println("closedddddddddddddddddddddddddddddddddddddddddddddd"+incident.getClosed_at());
                                                incident.setClosed_at(null);
                                        }
                                        // return incidentRepository.save(incident);
                                        Incident savedIncident = incidentRepository.save(incident);
                                        UpdateEmailNotification(savedIncident);
                                        return savedIncident;
                                        
                                })
                                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id " + id));

        }

        private void UpdateEmailNotification(Incident incident) {
                // Email to the contact (user who created the incident)
                String contactEmailSubject = "INC" + incident.getInc_id() + ": Your Service Desk Ticket Has Been Updated";
                String contactEmailBody = "<html><body style='font-family: Arial, sans-serif; color: #333;'>"
                        + "<div style='background-color: #f4f4f4; padding: 20px; border-radius: 8px;'>"
                        + "<h2 style='color: #2e6c8c;'>Your service desk ticket has been updated!</h2>"
                        + "<p>Your incident has been updated. Please see the details below:</p>"
                        + "<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Incident Number:</td><td style='padding: 8px;'>INC" + incident.getInc_id() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Summary:</td><td style='padding: 8px;'>" + incident.getInc_summary() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Description:</td><td style='padding: 8px;'>" + incident.getInc_description() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Priority:</td><td style='padding: 8px;'>" + incident.getInc_priority() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>" + incident.getStatusInfo().getStatus_name() + "</td></tr>"
                        + "</table>"
                        + "<p style='margin-top: 20px;'>If you have any additional information or updates regarding the issue, please update your ticket directly through the portal https://servicedesk-dev.cloudplusinfotech.com/user-dashboard/viewtickets/userworkhistory/incidents/"+incident.getInc_id()+"</p>"
                        + "<p style='font-size: 12px; color: #777;'>This is an automated message. Please do not reply directly to this email.</p>"
                        + "</div>"
                        + "</body></html>";
            
                String contactEmail = incident.getContact_email(); // The contact user's email
            
                // Send email to the contact (user who created the incident)
                SendEmail(contactEmail, contactEmailSubject, contactEmailBody);
            
                // Email to the assigned user (assigned to the incident)
                String assignedUserEmailSubject = "INC" + incident.getInc_id() + ": A New Update Has Been Made to the Incident Assigned to You";
            
                String assignedUserEmailBody = "<html><body style='font-family: Arial, sans-serif; color: #333;'>"
                        + "<div style='background-color: #f4f4f4; padding: 20px; border-radius: 8px;'>"
                        + "<h2 style='color: #2e6c8c;'>A new update has been made to the incident assigned to you!</h2>"
                        + "<p>An update has been made to the service desk incident assigned to you. Please see the details below:</p>"
                        + "<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Incident Number:</td><td style='padding: 8px;'>INC" + incident.getInc_id() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Summary:</td><td style='padding: 8px;'>" + incident.getInc_summary() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Description:</td><td style='padding: 8px;'>" + incident.getInc_description() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Priority:</td><td style='padding: 8px;'>" + incident.getInc_priority() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>" + incident.getStatusInfo().getStatus_name() + "</td></tr>"
                        + "</table>"
                        + "<p style='margin-top: 20px;'>Please review the incident and take necessary action. You can update the status through the support portal https://servicedesk-dev.cloudplusinfotech.com/support-dashboard/supportviewtickets/supportworkhistory/incidents/"+incident.getInc_id()+"</p>"
                        + "<p style='font-size: 12px; color: #777;'>This is an automated message. Please do not reply directly to this email.</p>"
                        + "</div>"
                        + "</body></html>";
            
                String assignedUserEmail = incident.getAssignmentgroup(); // The assigned user's email
            
                // Send email to the assigned user (incident assignee)
                SendEmail(assignedUserEmail, assignedUserEmailSubject, assignedUserEmailBody);
            }
            
        //     // Helper method to send emails
        //     private void UpdateEmail(String to, String subject, String body) {
        //         MimeMessagePreparator preparator = mimeMessage -> {
        //             MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true, "utf-8");
        //             message.setTo(to);
        //             message.setSubject(subject);
        //             message.setText(body, true);
        //             message.setFrom("aswathysankar777@gmail.com", "Cloudplus Service Desk");
        //         };
            
        //         try {
        //             mailSender.send(preparator);
        //         } catch (Exception e) {
        //             e.printStackTrace();
        //         }
        //     }
            

        public long getIncidentCount() {
                return incidentRepository.countIncidents(); // Call the repository method to get the count
        }

        public Incident createIncident(Incident newincident) {
                Timestamp createdtime =Timestamp.valueOf(ZonedDateTime.now(ZoneId.of("Asia/Kolkata")).toLocalDateTime());
                // Fetch the status info from the repository using status_id
                StatusInfo statusInfo = statusInfoRepository.findById("1")
                        .orElseThrow(() -> new ResourceNotFoundException("Status not found with id 1"));
                // Set the status info to the incident
                newincident.setStatusInfo(statusInfo);
                newincident.setInc_summary(newincident.getInc_summary());
                newincident.setInc_description(newincident.getInc_description());
                newincident.setInc_priority(newincident.getInc_priority());
                newincident.setContact_name(newincident.getContact_name());
                newincident.setContact_email(newincident.getContact_email());
                newincident.setAssignmentgroup(newincident.getAssignmentgroup());
                newincident.setCreated_by(newincident.getCreated_by());
                newincident.setCreated_at(createdtime);
                newincident.setUpdated_at(createdtime);

                //return incidentRepository.save(newincident);
                Incident savedIncident = incidentRepository.save(newincident);
                CreateEmailNotification(savedIncident);
                return savedIncident;
        }
        
        private void CreateEmailNotification(Incident incident) {
                // Email to the contact (user who created the incident)
                String contactEmailSubject = "INC" + incident.getInc_id() + ": Your Service Desk Ticket Has Been Created";
        
                String contactEmailBody = "<html><body style='font-family: Arial, sans-serif; color: #333;'>"
                + "<div style='background-color: #f4f4f4; padding: 20px; border-radius: 8px;'>"
                + "<h2 style='color: #2e6c8c;'>Thank you for reaching out to our support team!</h2>"
                + "<p>We have successfully received your request, and a service desk incident has been created.</p>"
                + "<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Incident Number:</td><td style='padding: 8px;'>INC" + incident.getInc_id() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Summary:</td><td style='padding: 8px;'>" + incident.getInc_summary() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Description:</td><td style='padding: 8px;'>" + incident.getInc_description() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Priority:</td><td style='padding: 8px;'>" + incident.getInc_priority() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>" + incident.getStatusInfo().getStatus_name() + "</td></tr>"
                + "</table>"
                + "<p style='margin-top: 20px;'>Our support team will review your ticket and get back to you as soon as possible. In the meantime, you can track the status of your request through our support portal at https://servicedesk-dev.cloudplusinfotech.com/.</p>"
                + "<p>If you have any additional information or updates regarding the issue, please update your ticket directly through the portal.</p>"
                + "<p style='font-size: 12px; color: #777;'>This is an automated message. Please do not reply directly to this email.</p>"
                + "</div>"
                + "</body></html>";
    
                String contactEmail = incident.getContact_email();
        
                // Send email to the contact (user who created the incident)
                SendEmail(contactEmail, contactEmailSubject, contactEmailBody);
        
                // Email to the assigned user (assigned to the incident)
                String assignedUserEmailSubject = "INC" + incident.getInc_id() + ": A New Incident Has Been Assigned To You";
        
                String assignedUserEmailBody = "<html><body style='font-family: Arial, sans-serif; color: #333;'>"
                + "<div style='background-color: #f4f4f4; padding: 20px; border-radius: 8px;'>"
                + "<h2 style='color: #2e6c8c;'>A new incident has been assigned to you!</h2>"
                + "<p>You have been assigned a new service desk incident. Please review the details below:</p>"
                + "<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Incident Number:</td><td style='padding: 8px;'>INC" + incident.getInc_id() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Summary:</td><td style='padding: 8px;'>" + incident.getInc_summary() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Description:</td><td style='padding: 8px;'>" + incident.getInc_description() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Priority:</td><td style='padding: 8px;'>" + incident.getInc_priority() + "</td></tr>"
                + "<tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>" + incident.getStatusInfo().getStatus_name() + "</td></tr>"
                + "</table>"
                + "<p style='margin-top: 20px;'>Please take a moment to review the incident and take necessary action. You can update the status through the support portal.</p>"
                + "<p style='font-size: 12px; color: #777;'>This is an automated message. Please do not reply directly to this email.</p>"
                + "</div>"
                + "</body></html>";
        
                String assignedUserEmail = incident.getAssignmentgroup(); // The assigned user's email
                
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
    

        public long getIncidentCountByStatusId(String statusId) {
                return incidentRepository.countByStatusId(statusId);
        }

        public long getCriticalTicketCount() {
                return incidentRepository.countCriticalTickets();
        }

      
}
