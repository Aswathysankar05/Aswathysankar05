package com.servicedesk.springboot_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.servicedesk.springboot_backend.dao.WorkHistoryRepository;
import com.servicedesk.springboot_backend.entity.WorkHistory;

@Service
public class WorkHistoryService {

    @Autowired
    private WorkHistoryRepository workhistoryRepository;

    public List<WorkHistory> getAllWorkHistorys() {
        List<WorkHistory> workhistorys = workhistoryRepository.findAll();
        System.out.println(workhistorys); // Log the incidents to check their structure
        return workhistorys;
    }

    public List<WorkHistory> findByWorkid(Long workid) {
        return workhistoryRepository.findByWorkid(workid);
    }
    // public Optional<WorkHistory> findByWorkid(Long workid) {
    // return workhistoryRepository.findByWorkid(workid);
    // }
    public WorkHistory addWorkHistory(WorkHistory newWorkHistory) {
        //System.out.println("workhistory serviceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"+newWorkHistory.getId()+"\n"+newWorkHistory.getWork_summary()+"\n"+newWorkHistory.getWorkid()+"\n"
        //+newWorkHistory.getAction_performed()+"\n"+newWorkHistory.getWork_description()+"\n"+newWorkHistory.getPerformed_by()+"\n"+newWorkHistory.getTimestamp());
        newWorkHistory.setId(newWorkHistory.getId());
        newWorkHistory.setWorkid(newWorkHistory.getWorkid());
        newWorkHistory.setWork_summary(newWorkHistory.getWork_summary());
        newWorkHistory.setAction_performed(newWorkHistory.getAction_performed());
        newWorkHistory.setWork_description(newWorkHistory.getWork_description());
        newWorkHistory.setPerformed_by(newWorkHistory.getPerformed_by());
        newWorkHistory.setTimestamp(newWorkHistory.getTimestamp());

        return workhistoryRepository.save(newWorkHistory);

    }

}