package com.example.demo.controller;

import com.example.demo.Model.AuditLogModel;
import com.example.demo.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLogModel>> getAllLogs() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }

    @GetMapping("/entity/{entityName}")
    public ResponseEntity<List<AuditLogModel>> getLogsByEntity(@PathVariable String entityName) {
        return ResponseEntity.ok(auditLogService.getLogsByEntity(entityName));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditLogModel>> getLogsByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(auditLogService.getLogsByUser(userId));
    }
}
