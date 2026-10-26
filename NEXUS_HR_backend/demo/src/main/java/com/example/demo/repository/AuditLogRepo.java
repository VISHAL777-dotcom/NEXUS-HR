package com.example.demo.repository;

import com.example.demo.Model.AuditLogModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepo extends JpaRepository<AuditLogModel, Integer> {
    List<AuditLogModel> findByEntityName(String entityName);
    List<AuditLogModel> findByUser_UserId(Integer userId);
}
