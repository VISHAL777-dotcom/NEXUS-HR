package com.example.demo.service;

import com.example.demo.Model.AuditLogModel;
import com.example.demo.Model.UserModel;
import com.example.demo.repository.AuditLogRepo;
import com.example.demo.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepo auditLogRepo;
    private final UserRepo userRepo;

    public List<AuditLogModel> getAllLogs() {
        return auditLogRepo.findAll();
    }

    public List<AuditLogModel> getLogsByEntity(String entityName) {
        return auditLogRepo.findByEntityName(entityName);
    }

    public List<AuditLogModel> getLogsByUser(Integer userId) {
        return auditLogRepo.findByUser_UserId(userId);
    }

    // Called internally by other services whenever a sensitive action occurs
    public AuditLogModel record(Integer userId, String action, String entityName, Integer entityId, String details) {
        AuditLogModel log = new AuditLogModel();
        if (userId != null) {
            UserModel user = userRepo.findById(userId).orElse(null);
            log.setUser(user);
        }
        log.setAction(action);
        log.setEntityName(entityName);
        log.setEntityId(entityId);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        return auditLogRepo.save(log);
    }
}
