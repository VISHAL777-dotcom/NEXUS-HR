package com.example.demo.repository;

import com.example.demo.Model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<UserModel, Integer> {
    Optional<UserModel> findByEmail(String email);
    Optional<UserModel> findByEmployeeCode(String employeeCode);
    List<UserModel> findByDepartment_DepartmentId(Integer departmentId);
    List<UserModel> findByRole_RoleId(Integer roleId);
    boolean existsByEmail(String email);
}
