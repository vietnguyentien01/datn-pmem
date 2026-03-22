package com.pmem.service;

import com.pmem.model.WorkSchedule;
import com.pmem.repository.WorkScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class WorkScheduleService {

    private final WorkScheduleRepository workScheduleRepository;

    public WorkSchedule getSchedule() {
        return workScheduleRepository.findAll().stream().findFirst()
                .orElseGet(this::createDefault);
    }

    @Transactional
    public WorkSchedule updateSchedule(WorkSchedule updated) {
        WorkSchedule schedule = getSchedule();
        schedule.setStandardCheckIn(updated.getStandardCheckIn());
        schedule.setStandardCheckOut(updated.getStandardCheckOut());
        schedule.setLateThresholdMinutes(updated.getLateThresholdMinutes());
        schedule.setEarlyLeaveThresholdMinutes(updated.getEarlyLeaveThresholdMinutes());
        return workScheduleRepository.save(schedule);
    }

    private WorkSchedule createDefault() {
        return workScheduleRepository.save(WorkSchedule.builder()
                .standardCheckIn(LocalTime.of(8, 0))
                .standardCheckOut(LocalTime.of(17, 30))
                .lateThresholdMinutes(30)
                .earlyLeaveThresholdMinutes(30)
                .build());
    }
}
