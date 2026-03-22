package com.pmem.dto;

import com.pmem.model.SalaryChangeRequest.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryChangeRequestDTO {
    private Long id;
    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private Double oldSalary;
    private Double newSalary;
    private String reason;
    private RequestStatus status;
    private String requestedByName;
    private String approvedByName;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
}
