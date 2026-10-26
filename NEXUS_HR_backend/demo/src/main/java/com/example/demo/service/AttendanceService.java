package com.example.demo.service;

import com.example.demo.Model.AttendanceModel;
import com.example.demo.Model.UserModel;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.AttendanceRepo;
import com.example.demo.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepo attendanceRepo;
    private final UserRepo userRepo;

    public List<AttendanceModel> getAllAttendance() {
        return attendanceRepo.findAll();
    }

    public AttendanceModel getAttendanceById(Integer id) {
        return attendanceRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance", id));
    }

    public List<AttendanceModel> getAttendanceByUser(Integer userId) {
        return attendanceRepo.findByUser_UserId(userId);
    }

    public List<AttendanceModel> getAttendanceByRange(Integer userId, LocalDate start, LocalDate end) {
        return attendanceRepo.findByUser_UserIdAndDateBetween(userId, start, end);
    }

    // Clock-in: creates today's attendance record if it doesn't already exist
    public AttendanceModel clockIn(Integer userId, String location) {
        UserModel user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        LocalDate today = LocalDate.now();
        boolean alreadyClockedIn = attendanceRepo.findByUser_UserIdAndDate(userId, today).isPresent();
        if (alreadyClockedIn) {
            throw new BadRequestException("User has already clocked in today.");
        }

        AttendanceModel attendance = new AttendanceModel();
        attendance.setUser(user);
        attendance.setDate(today);
        attendance.setClockIn(LocalDateTime.now());
        attendance.setStatus(AttendanceModel.Status.Present);
        attendance.setLocation(location);
        return attendanceRepo.save(attendance);
    }

    // Clock-out: closes today's record and computes focus hours
    public AttendanceModel clockOut(Integer userId) {
        LocalDate today = LocalDate.now();
        AttendanceModel attendance = attendanceRepo.findByUser_UserIdAndDate(userId, today)
                .orElseThrow(() -> new BadRequestException("No clock-in record found for today."));

        attendance.setClockOut(LocalDateTime.now());
        long minutes = Duration.between(attendance.getClockIn(), attendance.getClockOut()).toMinutes();
        BigDecimal hours = BigDecimal.valueOf(minutes).divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
        attendance.setFocusHours(hours);
        return attendanceRepo.save(attendance);
    }

    public void deleteAttendance(Integer id) {
        attendanceRepo.delete(getAttendanceById(id));
    }
}
