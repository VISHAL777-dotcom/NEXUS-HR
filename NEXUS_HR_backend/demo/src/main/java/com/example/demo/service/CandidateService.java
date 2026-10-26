package com.example.demo.service;

import com.example.demo.Model.CandidateModel;
import com.example.demo.Model.DepartmentModel;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CandidateRepo;
import com.example.demo.repository.DepartmentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepo candidateRepo;
    private final DepartmentRepo departmentRepo;

    public List<CandidateModel> getAllCandidates() {
        return candidateRepo.findAll();
    }

    public CandidateModel getCandidateById(Integer id) {
        return candidateRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", id));
    }

    public List<CandidateModel> getCandidatesByStage(CandidateModel.Stage stage) {
        return candidateRepo.findByStage(stage);
    }

    public CandidateModel createCandidate(CandidateModel candidate) {
        if (candidate.getDepartment() != null && candidate.getDepartment().getDepartmentId() != null) {
            DepartmentModel dept = departmentRepo.findById(candidate.getDepartment().getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", candidate.getDepartment().getDepartmentId()));
            candidate.setDepartment(dept);
        }
        candidate.setStage(CandidateModel.Stage.Applied);
        return candidateRepo.save(candidate);
    }

    // Moves a candidate to the next pipeline stage (kanban drag-and-drop)
    public CandidateModel moveStage(Integer id, CandidateModel.Stage newStage) {
        CandidateModel candidate = getCandidateById(id);
        candidate.setStage(newStage);
        return candidateRepo.save(candidate);
    }

    public CandidateModel updateAiScore(Integer id, Integer score) {
        CandidateModel candidate = getCandidateById(id);
        candidate.setAiScore(score);
        return candidateRepo.save(candidate);
    }

    public void deleteCandidate(Integer id) {
        candidateRepo.delete(getCandidateById(id));
    }
}
