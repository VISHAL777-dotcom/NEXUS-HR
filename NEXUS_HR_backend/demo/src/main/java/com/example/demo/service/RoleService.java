package com.example.demo.service;

import com.example.demo.Model.RoleModel;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.RoleRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepo roleRepo;

    public List<RoleModel> getAllRoles() {
        return roleRepo.findAll();
    }

    public RoleModel getRoleById(Integer id) {
        return roleRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", id));
    }

    public RoleModel createRole(RoleModel role) {
        return roleRepo.save(role);
    }

    public RoleModel updateRole(Integer id, RoleModel updated) {
        RoleModel existing = getRoleById(id);
        existing.setRoleName(updated.getRoleName());
        existing.setDescription(updated.getDescription());
        return roleRepo.save(existing);
    }

    public void deleteRole(Integer id) {
        RoleModel existing = getRoleById(id);
        roleRepo.delete(existing);
    }
}
