package com.example.demo.repository;

import com.example.demo.Model.RoleModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepo extends JpaRepository<RoleModel, Integer> {
    Optional<RoleModel> findByRoleName(String roleName);
}
