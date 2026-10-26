package com.example.demo.repository;

import com.example.demo.Model.LeaveBalanceModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeaveBalanceRepo extends JpaRepository<LeaveBalanceModel, Integer> {
    List<LeaveBalanceModel> findByUser_UserIdAndYear(Integer userId, Integer year);
    Optional<LeaveBalanceModel> findByUser_UserIdAndLeaveTypeAndYear(Integer userId, LeaveBalanceModel.LeaveType leaveType, Integer year);
}
