package com.example.demo.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Performance_Reviews Table
 * Maintains structured evaluation cycles, composite scoring, and
 * growth-goal tracking for every employee, rendered as the performance radar and ring.
 */
@Entity
@Table(name = "performance_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceReviewModel {

    public enum Status { Draft, Submitted, Finalized }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Integer reviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    private UserModel reviewer;

    @Column(name = "review_period", nullable = false, length = 20)
    private String reviewPeriod;

    @Column(name = "performance_score")
    private Integer performanceScore;

    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths;

    @Column(name = "goals", columnDefinition = "TEXT")
    private String goals;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status = Status.Draft;
}
