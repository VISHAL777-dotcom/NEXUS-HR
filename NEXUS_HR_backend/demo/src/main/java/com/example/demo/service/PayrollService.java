package com.example.demo.service;

import com.example.demo.Model.PayrollModel;
import com.example.demo.Model.UserModel;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.PayrollRepo;
import com.example.demo.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepo payrollRepo;
    private final UserRepo userRepo;

    public List<PayrollModel> getAllPayroll() {
        return payrollRepo.findAll();
    }

    public PayrollModel getPayrollById(Integer id) {
        return payrollRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll record", id));
    }

    public List<PayrollModel> getPayrollByUser(Integer userId) {
        return payrollRepo.findByUser_UserId(userId);
    }

    // Generates a payroll record for a given employee/period, computing net pay automatically
    public PayrollModel generatePayroll(Integer userId, PayrollModel payroll) {
        UserModel user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        BigDecimal gross = payroll.getBaseSalary().add(
                payroll.getBonus() != null ? payroll.getBonus() : BigDecimal.ZERO);
        BigDecimal deductions = (payroll.getTaxDeduction() != null ? payroll.getTaxDeduction() : BigDecimal.ZERO)
                .add(payroll.getPfDeduction() != null ? payroll.getPfDeduction() : BigDecimal.ZERO);

        payroll.setUser(user);
        payroll.setNetPay(gross.subtract(deductions));
        payroll.setStatus(PayrollModel.Status.Pending);
        return payrollRepo.save(payroll);
    }

    public PayrollModel markAsPaid(Integer id) {
        PayrollModel payroll = getPayrollById(id);
        payroll.setStatus(PayrollModel.Status.Paid);
        return payrollRepo.save(payroll);
    }

    public void deletePayroll(Integer id) {
        payrollRepo.delete(getPayrollById(id));
    }
}
