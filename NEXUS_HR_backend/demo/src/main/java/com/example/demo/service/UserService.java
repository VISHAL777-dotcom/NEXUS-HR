package com.example.demo.service;

import com.example.demo.Model.DepartmentModel;
import com.example.demo.Model.RoleModel;
import com.example.demo.Model.UserModel;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DepartmentRepo;
import com.example.demo.repository.RoleRepo;
import com.example.demo.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final DepartmentRepo departmentRepo;

    public List<UserModel> getAllUsers() {
        return userRepo.findAll();
    }

    public UserModel getUserById(Integer id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    public UserModel getUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + email));
    }

    public List<UserModel> getUsersByDepartment(Integer departmentId) {
        return userRepo.findByDepartment_DepartmentId(departmentId);
    }

    public UserModel registerUser(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already registered: " + req.getEmail());
        }

        RoleModel role = roleRepo.findById(req.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role", req.getRoleId()));

        UserModel user = new UserModel();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());
        user.setRole(role);
        user.setDesignation(req.getDesignation());
        user.setDateOfJoining(req.getDateOfJoining());
        user.setStatus(UserModel.Status.Active);

        if (req.getDepartmentId() != null) {
            DepartmentModel department = departmentRepo.findById(req.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", req.getDepartmentId()));
            user.setDepartment(department);
        }

        return userRepo.save(user);
    }

    public UserModel updateUser(Integer id, UserModel updated) {
        UserModel existing = getUserById(id);
        existing.setFullName(updated.getFullName());
        existing.setPhone(updated.getPhone());
        existing.setDesignation(updated.getDesignation());
        existing.setProfileImageUrl(updated.getProfileImageUrl());
        existing.setStatus(updated.getStatus());
        return userRepo.save(existing);
    }

    public void deleteUser(Integer id) {
        userRepo.delete(getUserById(id));
    }
}