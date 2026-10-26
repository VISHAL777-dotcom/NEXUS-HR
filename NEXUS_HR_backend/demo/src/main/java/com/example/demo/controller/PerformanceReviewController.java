package com.example.demo.controller;

import com.example.demo.Model.PerformanceReviewModel;
import com.example.demo.service.PerformanceReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performance-reviews")
@RequiredArgsConstructor
public class PerformanceReviewController {

    private final PerformanceReviewService performanceReviewService;

    @GetMapping
    public ResponseEntity<List<PerformanceReviewModel>> getAllReviews() {
        return ResponseEntity.ok(performanceReviewService.getAllReviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PerformanceReviewModel> getReviewById(@PathVariable Integer id) {
        return ResponseEntity.ok(performanceReviewService.getReviewById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PerformanceReviewModel>> getReviewsByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(performanceReviewService.getReviewsByUser(userId));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<PerformanceReviewModel> createReview(
            @PathVariable Integer userId,
            @RequestParam(required = false) Integer reviewerId,
            @RequestBody PerformanceReviewModel review) {
        return new ResponseEntity<>(performanceReviewService.createReview(userId, reviewerId, review), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/finalize")
    public ResponseEntity<PerformanceReviewModel> finalizeReview(@PathVariable Integer id) {
        return ResponseEntity.ok(performanceReviewService.finalizeReview(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Integer id) {
        performanceReviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
