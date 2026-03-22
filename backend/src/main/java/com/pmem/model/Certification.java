package com.pmem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "certifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Employee employee;

    @Column(nullable = false)
    private String name;

    @Column(name = "issued_by")
    private String issuedBy;

    @Column(name = "issue_date")
    private String issueDate;

    @Column(name = "expiry_date")
    private String expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "cert_type")
    private CertType certType;

    public enum CertType {
        DEGREE, CERTIFICATE
    }
}
