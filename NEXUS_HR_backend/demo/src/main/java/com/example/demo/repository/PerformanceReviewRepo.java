package com.example.demo.repository;

import com.example.demo.Model.PerformanceReviewModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerformanceReviewRepo extends JpaRepository<PerformanceReviewModel, Integer> {
    List<PerformanceReviewModel> findByUser_UserId(Integer userId);
    List<PerformanceReviewModel> findByReviewer_UserId(Integer reviewerId);
}
