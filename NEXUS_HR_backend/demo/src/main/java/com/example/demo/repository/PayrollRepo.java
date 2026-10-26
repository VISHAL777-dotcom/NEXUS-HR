package com.example.demo.repository;

import com.example.demo.Model.PayrollModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PayrollRepo extends JpaRepository<PayrollModel, Integer> {
    List<PayrollModel> findByUser_UserId(Integer userId);
    Optional<PayrollModel> findByUser_UserIdAndPayPeriod(Integer userId, String payPeriod);
}
