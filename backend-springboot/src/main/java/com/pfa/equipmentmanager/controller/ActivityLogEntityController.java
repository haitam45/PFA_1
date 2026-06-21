package com.pfa.equipmentmanager.controller;

import com.pfa.equipmentmanager.entity.ActivityLogEntity;
import com.pfa.equipmentmanager.service.ActivityLogEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*")
public class ActivityLogEntityController {

    private final ActivityLogEntityService logService;

    public ActivityLogEntityController(ActivityLogEntityService logService) {
        this.logService = logService;
    }

    @GetMapping
    public ResponseEntity<List<ActivityLogEntity>> getAllLogs() {
        return ResponseEntity.ok(logService.getAllLogs());
    }

    @PostMapping
    public ResponseEntity<ActivityLogEntity> createLog(@RequestBody ActivityLogEntity log) {
        return ResponseEntity.ok(logService.saveLog(log));
    }
}
