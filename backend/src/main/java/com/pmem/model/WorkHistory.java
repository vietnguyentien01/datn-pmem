package com.pmem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "work_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Employee employee;

    @Column(name = "company_name")
    private String companyName;

    private String position;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    @Column(columnDefinition = "TEXT")
    private String description;
}
