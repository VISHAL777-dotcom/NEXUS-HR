package com.example.demo.service;

import com.example.demo.Model.LeaveBalanceModel;
import com.example.demo.Model.UserModel;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.LeaveBalanceRepo;
import com.example.demo.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveBalanceService {

    private final LeaveBalanceRepo leaveBalanceRepo;
    private final UserRepo userRepo;

    public List<LeaveBalanceModel> getBalancesByUserAndYear(Integer userId, Integer year) {
        return leaveBalanceRepo.findByUser_UserIdAndYear(userId, year);
    }

    public LeaveBalanceModel getBalanceById(Integer id) {
        return leaveBalanceRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave balance", id));
    }

    public LeaveBalanceModel createBalance(Integer userId, LeaveBalanceModel balance) {
        UserModel user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        balance.setUser(user);
        return leaveBalanceRepo.save(balance);
    }

    public LeaveBalanceModel updateBalance(Integer id, LeaveBalanceModel updated) {
        LeaveBalanceModel existing = getBalanceById(id);
        existing.setTotalDays(updated.getTotalDays());
        existing.setUsedDays(updated.getUsedDays());
        return leaveBalanceRepo.save(existing);
    }

    public void deleteBalance(Integer id) {
        leaveBalanceRepo.delete(getBalanceById(id));
    }
}
