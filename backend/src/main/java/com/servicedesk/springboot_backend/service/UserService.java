package com.servicedesk.springboot_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.servicedesk.springboot_backend.dao.JobInfoRepository;
import com.servicedesk.springboot_backend.dao.UserRepository;
import com.servicedesk.springboot_backend.entity.JobInfo;
import com.servicedesk.springboot_backend.entity.User;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobInfoRepository jobInfoRepository;


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                     // Check if job_id is provided
                    if (updatedUser.getJobInfo() == null ||
                    updatedUser.getJobInfo().getJob_id() == null) {
                        throw new IllegalArgumentException("JobInfo and job_id must be provided");
                    }
                    JobInfo jobInfo = jobInfoRepository
                     .findById(updatedUser.getJobInfo().getJob_id())
                     .orElseThrow(() -> new ResourceNotFoundException("Job not found with id " + updatedUser.getJobInfo().getJob_id()));
                    
                    user.setJobInfo(jobInfo);
                    user.setFullname(updatedUser.getFullname());
                    user.setEmail(updatedUser.getEmail());
                    user.setPhonenumber(updatedUser.getPhonenumber());
                    user.setPswd(updatedUser.getPswd());
                    user.setUser_Type(updatedUser.getUser_Type());
                    user.setUser_Status(updatedUser.getUser_Status());
                    
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

    }

    public User createUser(User newuser) {
        JobInfo jobInfo = jobInfoRepository.findById(newuser.getJobInfo().getJob_id())
        .orElseThrow(() -> new ResourceNotFoundException("Job not found for id: " + newuser.getJobInfo().getJob_id()));
                
                newuser.setJobInfo(jobInfo);
                newuser.setFullname(newuser.getFullname());
                newuser.setEmail(newuser.getEmail());
                newuser.setPhonenumber(newuser.getPhonenumber());
                newuser.setPswd(newuser.getPswd());
                newuser.setPswdCnfrm(newuser.getPswdCnfrm());
                newuser.setUser_Type(newuser.getUser_Type());
				newuser.setUser_Status(newuser.getUser_Status());
               
				return userRepository.save(newuser);

    }
 

}
