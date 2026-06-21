package com.pfa.equipmentmanager.controller;

import com.pfa.equipmentmanager.entity.EquipmentEntity;
import com.pfa.equipmentmanager.service.EquipmentEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipments")
@CrossOrigin(origins = "*")
public class EquipmentEntityController {

    private final EquipmentEntityService equipmentService;

    public EquipmentEntityController(EquipmentEntityService equipmentService) {
        this.equipmentService = equipmentService;
    }

    @GetMapping
    public ResponseEntity<List<EquipmentEntity>> getAllEquipments() {
        return ResponseEntity.ok(equipmentService.getAllEquipments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentEntity> getById(@PathVariable String id) {
        return equipmentService.getEquipmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EquipmentEntity> createEquipment(@RequestBody EquipmentEntity eq) {
        return ResponseEntity.ok(equipmentService.saveEquipment(eq));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipmentEntity> updateEquipment(@PathVariable String id, @RequestBody EquipmentEntity eq) {
        return equipmentService.updateEquipment(id, eq)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEquipment(@PathVariable String id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.ok(Map.of("message", "Équipement retiré avec succès"));
    }
}
