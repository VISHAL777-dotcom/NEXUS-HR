package com.example.demo.controller;

import com.example.demo.Model.LeaveBalanceModel;
import com.example.demo.service.LeaveBalanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-balances")
@RequiredArgsConstructor
public class LeaveBalanceController {

    private final LeaveBalanceService leaveBalanceService;

    @GetMapping("/user/{userId}/year/{year}")
    public ResponseEntity<List<LeaveBalanceModel>> getBalancesByUserAndYear(@PathVariable Integer userId, @PathVariable Integer year) {
        return ResponseEntity.ok(leaveBalanceService.getBalancesByUserAndYear(userId, year));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveBalanceModel> getBalanceById(@PathVariable Integer id) {
        return ResponseEntity.ok(leaveBalanceService.getBalanceById(id));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<LeaveBalanceModel> createBalance(@PathVariable Integer userId, @RequestBody LeaveBalanceModel balance) {
        return new ResponseEntity<>(leaveBalanceService.createBalance(userId, balance), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaveBalanceModel> updateBalance(@PathVariable Integer id, @RequestBody LeaveBalanceModel balance) {
        return ResponseEntity.ok(leaveBalanceService.updateBalance(id, balance));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBalance(@PathVariable Integer id) {
        leaveBalanceService.deleteBalance(id);
        return ResponseEntity.noContent().build();
    }
}
