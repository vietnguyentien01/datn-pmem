package com.pmem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employees")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_code", unique = true)
    private String employeeCode;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private String department;
    private String position;
    private String gender;
    private String address;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "base_salary")
    private Double baseSalary;

    @Column(name = "join_date")
    private String joinDate;

    @Enumerated(EnumType.STRING)
    private EmployeeStatus status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private User user;

    public enum EmployeeStatus {
        ACTIVE, INACTIVE, ON_LEAVE
    }
}
