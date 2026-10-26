package com.example.demo.service;

import com.example.demo.Model.LeaveBalanceModel;
import com.example.demo.Model.LeaveRequestModel;
import com.example.demo.Model.UserModel;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.LeaveBalanceRepo;
import com.example.demo.repository.LeaveRequestRepo;
import com.example.demo.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {

    private final LeaveRequestRepo leaveRequestRepo;
    private final LeaveBalanceRepo leaveBalanceRepo;
    private final UserRepo userRepo;

    public List<LeaveRequestModel> getAllLeaveRequests() {
        return leaveRequestRepo.findAll();
    }

    public LeaveRequestModel getLeaveRequestById(Integer id) {
        return leaveRequestRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request", id));
    }

    public List<LeaveRequestModel> getLeaveRequestsByUser(Integer userId) {
        return leaveRequestRepo.findByUser_UserId(userId);
    }

    public List<LeaveRequestModel> getPendingRequests() {
        return leaveRequestRepo.findByStatus(LeaveRequestModel.Status.Pending);
    }

    public LeaveRequestModel createLeaveRequest(Integer userId, LeaveRequestModel request) {
        UserModel user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        request.setUser(user);
        request.setStatus(LeaveRequestModel.Status.Pending);
        return leaveRequestRepo.save(request);
    }

    // Approves a leave request and deducts the used days from the employee's balance
    public LeaveRequestModel approveLeaveRequest(Integer leaveId, Integer approverId, String comment) {
        LeaveRequestModel request = getLeaveRequestById(leaveId);
        UserModel approver = userRepo.findById(approverId)
                .orElseThrow(() -> new ResourceNotFoundException("User", approverId));

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        int year = request.getStartDate().getYear();

        if (request.getLeaveType() != LeaveRequestModel.LeaveType.Unpaid) {
            LeaveBalanceModel.LeaveType balanceType = LeaveBalanceModel.LeaveType.valueOf(request.getLeaveType().name());
            LeaveBalanceModel balance = leaveBalanceRepo
                    .findByUser_UserIdAndLeaveTypeAndYear(request.getUser().getUserId(), balanceType, year)
                    .orElseThrow(() -> new BadRequestException("No leave balance configured for this employee/year."));

            BigDecimal remaining = balance.getTotalDays().subtract(balance.getUsedDays());
            if (remaining.compareTo(BigDecimal.valueOf(days)) < 0) {
                throw new BadRequestException("Insufficient leave balance for this request.");
            }
            balance.setUsedDays(balance.getUsedDays().add(BigDecimal.valueOf(days)));
            leaveBalanceRepo.save(balance);
        }

        request.setStatus(LeaveRequestModel.Status.Approved);
        request.setApprovedBy(approver);
        request.setManagerComment(comment);
        return leaveRequestRepo.save(request);
    }

    public LeaveRequestModel rejectLeaveRequest(Integer leaveId, Integer approverId, String comment) {
        LeaveRequestModel request = getLeaveRequestById(leaveId);
        UserModel approver = userRepo.findById(approverId)
                .orElseThrow(() -> new ResourceNotFoundException("User", approverId));
        request.setStatus(LeaveRequestModel.Status.Rejected);
        request.setApprovedBy(approver);
        request.setManagerComment(comment);
        return leaveRequestRepo.save(request);
    }

    public void deleteLeaveRequest(Integer id) {
        leaveRequestRepo.delete(getLeaveRequestById(id));
    }
}
