package com.example.demo.controller;

import com.example.demo.Model.AttendanceModel;
import com.example.demo.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<AttendanceModel>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceModel> getAttendanceById(@PathVariable Integer id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AttendanceModel>> getAttendanceByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByUser(userId));
    }

    @GetMapping("/user/{userId}/range")
    public ResponseEntity<List<AttendanceModel>> getAttendanceByRange(
            @PathVariable Integer userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(attendanceService.getAttendanceByRange(userId, start, end));
    }

    @PostMapping("/user/{userId}/clock-in")
    public ResponseEntity<AttendanceModel> clockIn(@PathVariable Integer userId, @RequestBody(required = false) Map<String, String> body) {
        String location = body != null ? body.get("location") : null;
        return ResponseEntity.ok(attendanceService.clockIn(userId, location));
    }

    @PostMapping("/user/{userId}/clock-out")
    public ResponseEntity<AttendanceModel> clockOut(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.clockOut(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Integer id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }
}
