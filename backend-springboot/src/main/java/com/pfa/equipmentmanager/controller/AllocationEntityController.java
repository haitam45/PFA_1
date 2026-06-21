package com.pfa.equipmentmanager.controller;

import com.pfa.equipmentmanager.entity.AllocationEntity;
import com.pfa.equipmentmanager.service.AllocationEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
@CrossOrigin(origins = "*")
public class AllocationEntityController {

    private final AllocationEntityService allocationService;

    public AllocationEntityController(AllocationEntityService allocationService) {
        this.allocationService = allocationService;
    }

    @GetMapping
    public ResponseEntity<List<AllocationEntity>> getAllAllocations() {
        return ResponseEntity.ok(allocationService.getAllAllocations());
    }

    @PostMapping
    public ResponseEntity<AllocationEntity> createAllocation(@RequestBody AllocationEntity allocation) {
        return ResponseEntity.ok(allocationService.saveAllocation(allocation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AllocationEntity> updateAllocation(@PathVariable String id, @RequestBody AllocationEntity allocation) {
        return allocationService.updateAllocation(id, allocation)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
