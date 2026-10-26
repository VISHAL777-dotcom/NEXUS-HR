package com.example.demo.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Candidates Table
 * Tracks recruitment pipeline applicants, resume references, and
 * AI-assisted evaluation scoring shown on the Recruitment kanban board.
 */
@Entity
@Table(name = "candidates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidateModel {

    public enum Stage { Applied, Screening, Interview, Offer, Hired }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "candidate_id")
    private Integer candidateId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "applied_role", nullable = false, length = 150)
    private String appliedRole;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private DepartmentModel department;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "stage", nullable = false, length = 20)
    private Stage stage = Stage.Applied;

    @Column(name = "ai_score")
    private Integer aiScore;

    @Column(name = "interview_date")
    private LocalDateTime interviewDate;
}
