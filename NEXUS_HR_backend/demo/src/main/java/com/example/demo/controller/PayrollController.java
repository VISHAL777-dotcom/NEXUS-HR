package com.example.demo.controller;

import com.example.demo.Model.PayrollModel;
import com.example.demo.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @GetMapping
    public ResponseEntity<List<PayrollModel>> getAllPayroll() {
        return ResponseEntity.ok(payrollService.getAllPayroll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PayrollModel> getPayrollById(@PathVariable Integer id) {
        return ResponseEntity.ok(payrollService.getPayrollById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PayrollModel>> getPayrollByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(payrollService.getPayrollByUser(userId));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<PayrollModel> generatePayroll(@PathVariable Integer userId, @RequestBody PayrollModel payroll) {
        return new ResponseEntity<>(payrollService.generatePayroll(userId, payroll), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/mark-paid")
    public ResponseEntity<PayrollModel> markAsPaid(@PathVariable Integer id) {
        return ResponseEntity.ok(payrollService.markAsPaid(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayroll(@PathVariable Integer id) {
        payrollService.deletePayroll(id);
        return ResponseEntity.noContent().build();
    }
}
