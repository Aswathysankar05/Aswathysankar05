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

import com.servicedesk.springboot_backend.dao.RequestRepository;
import com.servicedesk.springboot_backend.dao.StatusInfoRepository;
import com.servicedesk.springboot_backend.entity.Request;
import com.servicedesk.springboot_backend.entity.StatusInfo;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private StatusInfoRepository statusInfoRepository;
        
    @Autowired
    private JavaMailSender mailSender;

    public List<Request> getAllRequests() {
        List<Request> requests = requestRepository.findAll();
        System.out.println(requests); 
        return requests;
    }

    public Optional<Request> findById(Long id) {
        return requestRepository.findById(id);
    }

    public Request updateRequest(Long id, Request updatedRequest) {
        return requestRepository.findById(id)
                .map(request -> {
                    Timestamp currenttime =Timestamp.valueOf(ZonedDateTime.now(ZoneId.of("Asia/Kolkata")).toLocalDateTime());
                    // Check if status_id is provided
                    if (updatedRequest.getStatusInfo() == null ||
                                        updatedRequest.getStatusInfo().getStatus_id() == null) {
                    throw new IllegalArgumentException(
                            "StatusInfo and status_id must be provided");
                    }
                    StatusInfo statusInfo = statusInfoRepository
                                        .findById(updatedRequest.getStatusInfo().getStatus_id())
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                "Status not found with id " + updatedRequest
                                                    .getStatusInfo()
                                                    .getStatus_id()));

                    // request.setReq_summary(updatedRequest.getReq_summary());
                    // request.setReq_description(updatedRequest.getReq_description());
                    // request.setReq_priority(request.getReq_priority());
                    // request.setContact_name(request.getContact_name());
                    // request.setContact_email(request.getContact_email());
                    request.setAssignmentgroup(updatedRequest.getAssignmentgroup());
                    //request.setCreated_by(updatedRequest.getCreated_by());
                    //request.setCreated_at(updatedRequest.getCreated_at());
                    request.setUpdated_at(currenttime);
                    request.setStatusInfo(statusInfo);
                    // Check if status is being updated to "Close"
                    String preStatusId = request.getStatusInfo() != null ? request.getStatusInfo().getStatus_id()
                             : null;
                     
                    // if ("2".equalsIgnoreCase(request.getStatusInfo().getStatus_id().toString()) &&
                    //         !"2".equalsIgnoreCase(preStatusId != null ? preStatusId.toString() : null)) {
                    //             request.setClosed_at(
                    //                 Timestamp.valueOf(ZonedDateTime.now(ZoneId.of("Asia/Kolkata")).toLocalDateTime()));
                                
                               
                    // } else {
                    //      System.out.println("closedddddddddddddddddddddddddddddddddddddddddddddd");
                     
                    //      request.setClosed_at(request.getClosed_at());
                    // }
                    if ("2".equalsIgnoreCase(request.getStatusInfo().getStatus_id() != null ? request.getStatusInfo().getStatus_id().toString() : null)) {
                        request.setClosed_at(currenttime);
                    } else {
                        request.setClosed_at(null);
                    }
                    // return requestRepository.save(request);
                    Request savedRequest = requestRepository.save(request);
                    UpdateEmailNotification(savedRequest);
                    return savedRequest;
                })
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id " + id));
    }

    private void UpdateEmailNotification(Request request) {
                // Email to the contact (user who created the incident)
                String contactEmailSubject = "REQ" + request.getReq_id() + ": Your Service Desk Ticket Has Been Updated";
                String contactEmailBody = "<html><body style='font-family: Arial, sans-serif; color: #333;'>"
                        + "<div style='background-color: #f4f4f4; padding: 20px; border-radius: 8px;'>"
                        + "<h2 style='color: #2e6c8c;'>Your service desk ticket has been updated!</h2>"
                        + "<p>Your request has been updated. Please see the details below:</p>"
                        + "<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Request Number:</td><td style='padding: 8px;'>REQ" + request.getReq_id() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Summary:</td><td style='padding: 8px;'>" + request.getReq_summary() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Description:</td><td style='padding: 8px;'>" + request.getReq_description() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Priority:</td><td style='padding: 8px;'>" + request.getReq_priority() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>" + request.getStatusInfo().getStatus_name() + "</td></tr>"
                        + "</table>"
                        + "<p style='margin-top: 20px;'>If you have any additional information or updates regarding the issue, please update your ticket directly through the portal https://servicedesk-dev.cloudplusinfotech.com/user-dashboard/viewtickets/userworkhistory/requests/"+request.getReq_id()+"</p>"
                        + "<p style='font-size: 12px; color: #777;'>This is an automated message. Please do not reply directly to this email.</p>"
                        + "</div>"
                        + "</body></html>";
            
                String contactEmail = request.getContact_email(); 
            
                // Send email to the contact (user who created the incident)
                SendEmail(contactEmail, contactEmailSubject, contactEmailBody);
            
                // Email to the assigned user (assigned to the incident)
                String assignedUserEmailSubject = "REQ" + request.getReq_id() + ": A New Update Has Been Made to the Request Assigned to You";
            
                String assignedUserEmailBody = "<html><body style='font-family: Arial, sans-serif; color: #333;'>"
                        + "<div style='background-color: #f4f4f4; padding: 20px; border-radius: 8px;'>"
                        + "<h2 style='color: #2e6c8c;'>A new update has been made to the request assigned to you!</h2>"
                        + "<p>An update has been made to the service desk incident assigned to you. Please see the details below:</p>"
                        + "<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Incident Number:</td><td style='padding: 8px;'>REQ" + request.getReq_id() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Summary:</td><td style='padding: 8px;'>" + request.getReq_summary() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Description:</td><td style='padding: 8px;'>" + request.getReq_description() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Priority:</td><td style='padding: 8px;'>" + request.getReq_priority() + "</td></tr>"
                        + "<tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>" + request.getStatusInfo().getStatus_name() + "</td></tr>"
                        + "</table>"
                        + "<p style='margin-top: 20px;'>Please review the request and take necessary action. You can update the status through the support portal https://servicedesk-dev.cloudplusinfotech.com/support-dashboard/supportviewtickets/supportworkhistory/requests/"+request.getReq_id()+"</p>"
                        + "<p style='font-size: 12px; color: #777;'>This is an automated message. Please do not reply directly to this email.</p>"
                        + "</div>"
                        + "</body></html>";
            
                String assignedUserEmail = request.getAssignmentgroup(); // The assigned user's email
            
                // Send email to the assigned user (incident assignee)
                SendEmail(assignedUserEmail, assignedUserEmailSubject, assignedUserEmailBody);
            }
            
    public long getRequestCount() {
        return requestRepository.countRequests(); // Call the repository method to get the count
    }

    public Request createRequest(Request newrequest) {
                Timestamp createdtime =Timestamp.valueOf(ZonedDateTime.now(ZoneId.of("Asia/Kolkata")).toLocalDateTime());
                // Fetch the status info from the repository using status_id
                StatusInfo statusInfo = statusInfoRepository.findById("1")
                        .orElseThrow(() -> new ResourceNotFoundException("Status not found with id 1"));

                // Set the status info to the Request
                newrequest.setStatusInfo(statusInfo);

                newrequest.setReq_summary(newrequest.getReq_summary());
                newrequest.setReq_description(newrequest.getReq_description());
                newrequest.setReq_priority(newrequest.getReq_priority());
                newrequest.setContact_name(newrequest.getContact_name());
                newrequest.setContact_email(newrequest.getContact_email());
                newrequest.setAssignmentgroup(newrequest.getAssignmentgroup());
                newrequest.setCreated_by(newrequest.getCreated_by());
                // newrequest.setCreated_at(Timestamp.valueOf(ZonedDateTime.now(ZoneId.of("Asia/Kolkata")).toLocalDateTime()));
                // newrequest.setUpdated_at(Timestamp.valueOf(ZonedDateTime.now(ZoneId.of("Asia/Kolkata")).toLocalDateTime()));
                newrequest.setCreated_at(createdtime);
                newrequest.setUpdated_at(createdtime);

                //return requestRepository.save(newrequest);

                Request savedRequest = requestRepository.save(newrequest);
                sendEmailNotification(savedRequest);
                return savedRequest;
        }

    private void sendEmailNotification(Request request) {
        // Create an email message
        String contactEmailSubject = "REQ"+request.getReq_id()+": Your Service Desk Ticket Has Been Created";
        
        String contactEmailBody = "<html><body style='font-family: Arial, sans-serif; color: #333;'>"
        + "<div style='background-color: #f4f4f4; padding: 20px; border-radius: 8px;'>"
        + "<h2 style='color: #2e6c8c;'>Thank you for reaching out to our support team!</h2>"
        + "<p>We have successfully received your request, and a service desk request has been created.</p>"
        + "<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>"
        + "<tr><td style='padding: 8px; font-weight: bold;'>Incident Number:</td><td style='padding: 8px;'>REQ" + request.getReq_id() + "</td></tr>"
        + "<tr><td style='padding: 8px; font-weight: bold;'>Summary:</td><td style='padding: 8px;'>" + request.getReq_summary() + "</td></tr>"
        + "<tr><td style='padding: 8px; font-weight: bold;'>Description:</td><td style='padding: 8px;'>" + request.getReq_description() + "</td></tr>"
        + "<tr><td style='padding: 8px; font-weight: bold;'>Priority:</td><td style='padding: 8px;'>" + request.getReq_priority() + "</td></tr>"
        + "<tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>" + request.getStatusInfo().getStatus_name() + "</td></tr>"
        + "</table>"
        + "<p style='margin-top: 20px;'>Our support team will review your ticket and get back to you as soon as possible. In the meantime, you can track the status of your request through our support portal at https://servicedesk-dev.cloudplusinfotech.com/.</p>"
        + "<p>If you have any additional information or updates regarding the issue, please update your ticket directly through the portal.</p>"
        + "<p style='font-size: 12px; color: #777;'>This is an automated message. Please do not reply directly to this email.</p>"
        + "</div>"
        + "</body></html>";
            
        String contactEmail = request.getContact_email(); 

        // Send email to the contact (user who created the incident)
        SendEmail(contactEmail, contactEmailSubject, contactEmailBody);
        
        // Email to the assigned user (assigned to the incident)
        String assignedUserEmailSubject = "INC" + request.getReq_id() + ": A New Incident Has Been Assigned To You";
        
        String assignedUserEmailBody = "<html><body style='font-family: Arial, sans-serif; color: #333;'>"
        + "<div style='background-color: #f4f4f4; padding: 20px; border-radius: 8px;'>"
        + "<h2 style='color: #2e6c8c;'>A new request has been assigned to you!</h2>"
        + "<p>You have been assigned a new service desk request. Please review the details below:</p>"
        + "<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>"
        + "<tr><td style='padding: 8px; font-weight: bold;'>Request Number:</td><td style='padding: 8px;'>REQ" + request.getReq_id() + "</td></tr>"
        + "<tr><td style='padding: 8px; font-weight: bold;'>Summary:</td><td style='padding: 8px;'>" + request.getReq_summary() + "</td></tr>"
        + "<tr><td style='padding: 8px; font-weight: bold;'>Description:</td><td style='padding: 8px;'>" + request.getReq_description() + "</td></tr>"
        + "<tr><td style='padding: 8px; font-weight: bold;'>Priority:</td><td style='padding: 8px;'>" + request.getReq_priority() + "</td></tr>"
        + "<tr><td style='padding: 8px; font-weight: bold;'>Status:</td><td style='padding: 8px;'>" + request.getStatusInfo().getStatus_name() + "</td></tr>"
        + "</table>"
        + "<p style='margin-top: 20px;'>Please take a moment to review the request and take necessary action. You can update the status through the support portal.</p>"
        + "<p style='font-size: 12px; color: #777;'>This is an automated message. Please do not reply directly to this email.</p>"
        + "</div>"
        + "</body></html>";

        String assignedUserEmail = request.getAssignmentgroup(); // The assigned user's email
        
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

        public long getRequestCountByStatusId(String statusId) {
            return requestRepository.countByStatusId(statusId);
        }
    
        public long getCriticalTicketCount() {
            return requestRepository.countCriticalTickets();
        }

}
