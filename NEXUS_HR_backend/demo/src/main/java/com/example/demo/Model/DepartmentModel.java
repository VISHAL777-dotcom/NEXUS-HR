package com.example.demo.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Departments Table
 * Maintains the organizational department clusters used for grouping
 * employees, reporting lines, and analytics segmentation.
 */
@Entity
@Table(name = "departments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id")
    private Integer departmentId;

    @Column(name = "department_name", nullable = false, unique = true, length = 100)
    private String departmentName;

    // Assigned department head user index target (FK) - nullable, resolved manually to avoid circular fetch with Users
    @Column(name = "head_user_id")
    private Integer headUserId;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", length = 50)
    private String status = "Active";
}
