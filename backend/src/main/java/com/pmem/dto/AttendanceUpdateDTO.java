package com.pmem.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class AttendanceUpdateDTO {
    private LocalTime checkIn;
    private LocalTime checkOut;
    private String status;
    private String note;
}
