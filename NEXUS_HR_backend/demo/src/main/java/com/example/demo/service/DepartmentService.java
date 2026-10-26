package com.example.demo.service;

import com.example.demo.Model.DepartmentModel;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DepartmentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepo departmentRepo;

    public List<DepartmentModel> getAllDepartments() {
        return departmentRepo.findAll();
    }

    public DepartmentModel getDepartmentById(Integer id) {
        return departmentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", id));
    }

    public DepartmentModel createDepartment(DepartmentModel department) {
        return departmentRepo.save(department);
    }

    public DepartmentModel updateDepartment(Integer id, DepartmentModel updated) {
        DepartmentModel existing = getDepartmentById(id);
        existing.setDepartmentName(updated.getDepartmentName());
        existing.setHeadUserId(updated.getHeadUserId());
        existing.setDescription(updated.getDescription());
        existing.setStatus(updated.getStatus());
        return departmentRepo.save(existing);
    }

    public void deleteDepartment(Integer id) {
        departmentRepo.delete(getDepartmentById(id));
    }
}
