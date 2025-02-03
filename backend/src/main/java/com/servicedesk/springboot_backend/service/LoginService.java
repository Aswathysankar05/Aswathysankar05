package com.servicedesk.springboot_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.servicedesk.springboot_backend.dao.JobInfoRepository;
import com.servicedesk.springboot_backend.dao.LoginRepository;
import com.servicedesk.springboot_backend.entity.JobInfo;
import com.servicedesk.springboot_backend.entity.Login;

@Service
public class LoginService {
    @Autowired
    private LoginRepository loginRepository;

     @Autowired
    private JobInfoRepository jobInfoRepository;

    public List<Login> getAllLogins() {
        return loginRepository.findAll();
    }

    public Login authenticate(String email, String pswd) {
        Login login = loginRepository.findByEmail(email);
        if (login != null && login.getPswd().equals(pswd)) {
            return login; // Return the user or some DTO
        }
        return null; // Invalid credentials
    }

    public Login createLogin(Login newlogin) {

        JobInfo jobInfo = jobInfoRepository.findById(newlogin.getJobInfo().getJob_id())
        .orElseThrow(() -> new ResourceNotFoundException("Job not found for id: " + newlogin.getJobInfo().getJob_id()));

        // Set the jobInfo in the new login entry
                newlogin.setJobInfo(jobInfo);
                newlogin.setFullname(newlogin.getFullname());
                // System.out.println("nameeeeeeeeeeeeeeeeeeeeeeeeeee"+newlogin.getFullname());
                newlogin.setEmail(newlogin.getEmail());
                newlogin.setPhonenumber(newlogin.getPhonenumber());
                newlogin.setPswd(newlogin.getPswd());
                newlogin.setPswdCnfrm(newlogin.getPswdCnfrm());
                newlogin.setUserType(newlogin.getUserType());
				newlogin.setUser_Status(newlogin.getUser_Status());
               
				return loginRepository.save(newlogin);

        // Save the new login entry
        // return loginRepository.save(newlogin);

    }

    

}
