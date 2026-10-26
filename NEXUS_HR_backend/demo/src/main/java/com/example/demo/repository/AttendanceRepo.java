package com.example.demo.repository;

import com.example.demo.Model.AttendanceModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepo extends JpaRepository<AttendanceModel, Integer> {
    List<AttendanceModel> findByUser_UserId(Integer userId);
    Optional<AttendanceModel> findByUser_UserIdAndDate(Integer userId, LocalDate date);
    List<AttendanceModel> findByDateBetween(LocalDate start, LocalDate end);
    List<AttendanceModel> findByUser_UserIdAndDateBetween(Integer userId, LocalDate start, LocalDate end);
}
