package com.example.demo.service;

import com.example.demo.Model.PerformanceReviewModel;
import com.example.demo.Model.UserModel;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.PerformanceReviewRepo;
import com.example.demo.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerformanceReviewService {

    private final PerformanceReviewRepo performanceReviewRepo;
    private final UserRepo userRepo;

    public List<PerformanceReviewModel> getAllReviews() {
        return performanceReviewRepo.findAll();
    }

    public PerformanceReviewModel getReviewById(Integer id) {
        return performanceReviewRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance review", id));
    }

    public List<PerformanceReviewModel> getReviewsByUser(Integer userId) {
        return performanceReviewRepo.findByUser_UserId(userId);
    }

    public PerformanceReviewModel createReview(Integer userId, Integer reviewerId, PerformanceReviewModel review) {
        UserModel user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        review.setUser(user);

        if (reviewerId != null) {
            UserModel reviewer = userRepo.findById(reviewerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Reviewer", reviewerId));
            review.setReviewer(reviewer);
        }
        review.setStatus(PerformanceReviewModel.Status.Draft);
        return performanceReviewRepo.save(review);
    }

    public PerformanceReviewModel finalizeReview(Integer id) {
        PerformanceReviewModel review = getReviewById(id);
        review.setStatus(PerformanceReviewModel.Status.Finalized);
        return performanceReviewRepo.save(review);
    }

    public void deleteReview(Integer id) {
        performanceReviewRepo.delete(getReviewById(id));
    }
}
