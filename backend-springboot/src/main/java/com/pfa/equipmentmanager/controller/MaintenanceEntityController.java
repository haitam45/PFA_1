package com.pfa.equipmentmanager.controller;

import com.pfa.equipmentmanager.entity.MaintenanceEntity;
import com.pfa.equipmentmanager.service.MaintenanceEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenances")
@CrossOrigin(origins = "*")
public class MaintenanceEntityController {

    private final MaintenanceEntityService maintenanceService;

    public MaintenanceEntityController(MaintenanceEntityService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceEntity>> getAllMaintenances() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenances());
    }

    @PostMapping
    public ResponseEntity<MaintenanceEntity> createMaintenance(@RequestBody MaintenanceEntity maint) {
        return ResponseEntity.ok(maintenanceService.saveMaintenance(maint));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceEntity> updateMaintenance(@PathVariable String id, @RequestBody MaintenanceEntity maint) {
        return maintenanceService.updateMaintenance(id, maint)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
