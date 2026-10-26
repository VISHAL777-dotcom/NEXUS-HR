package com.example.demo.repository;

import com.example.demo.Model.DepartmentModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepo extends JpaRepository<DepartmentModel, Integer> {
    Optional<DepartmentModel> findByDepartmentName(String departmentName);
}
