package com.example.demo.repository;

import com.example.demo.Model.CandidateModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateRepo extends JpaRepository<CandidateModel, Integer> {
    List<CandidateModel> findByStage(CandidateModel.Stage stage);
    List<CandidateModel> findByDepartment_DepartmentId(Integer departmentId);
}
