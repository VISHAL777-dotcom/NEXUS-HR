package com.example.demo.controller;

import com.example.demo.Model.LeaveRequestModel;
import com.example.demo.service.LeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leave-requests")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    @GetMapping
    public ResponseEntity<List<LeaveRequestModel>> getAllLeaveRequests() {
        return ResponseEntity.ok(leaveRequestService.getAllLeaveRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequestModel> getLeaveRequestById(@PathVariable Integer id) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LeaveRequestModel>> getLeaveRequestsByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestsByUser(userId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequestModel>> getPendingRequests() {
        return ResponseEntity.ok(leaveRequestService.getPendingRequests());
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<LeaveRequestModel> createLeaveRequest(@PathVariable Integer userId, @RequestBody LeaveRequestModel request) {
        return new ResponseEntity<>(leaveRequestService.createLeaveRequest(userId, request), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<LeaveRequestModel> approveLeaveRequest(
            @PathVariable Integer id,
            @RequestParam Integer approverId,
            @RequestBody(required = false) Map<String, String> body) {
        String comment = body != null ? body.get("comment") : null;
        return ResponseEntity.ok(leaveRequestService.approveLeaveRequest(id, approverId, comment));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<LeaveRequestModel> rejectLeaveRequest(
            @PathVariable Integer id,
            @RequestParam Integer approverId,
            @RequestBody(required = false) Map<String, String> body) {
        String comment = body != null ? body.get("comment") : null;
        return ResponseEntity.ok(leaveRequestService.rejectLeaveRequest(id, approverId, comment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeaveRequest(@PathVariable Integer id) {
        leaveRequestService.deleteLeaveRequest(id);
        return ResponseEntity.noContent().build();
    }
}
