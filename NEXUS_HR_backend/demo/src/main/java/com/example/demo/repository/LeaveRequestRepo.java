package com.example.demo.repository;

import com.example.demo.Model.LeaveRequestModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepo extends JpaRepository<LeaveRequestModel, Integer> {
    List<LeaveRequestModel> findByUser_UserId(Integer userId);
    List<LeaveRequestModel> findByStatus(LeaveRequestModel.Status status);
}
