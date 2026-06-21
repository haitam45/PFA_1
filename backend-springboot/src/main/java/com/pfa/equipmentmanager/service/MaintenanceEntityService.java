package com.pfa.equipmentmanager.service;

import com.pfa.equipmentmanager.entity.MaintenanceEntity;
import com.pfa.equipmentmanager.repository.MaintenanceEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceEntityService {

    private final MaintenanceEntityRepository repository;

    public MaintenanceEntityService(MaintenanceEntityRepository repository) {
        this.repository = repository;
    }

    public List<MaintenanceEntity> getAllMaintenances() {
        return repository.findAll();
    }

    public Optional<MaintenanceEntity> getMaintenanceById(String id) {
        return repository.findById(id);
    }

    public List<MaintenanceEntity> getMaintenancesByEquipment(String equipmentId) {
        return repository.findByEquipmentId(equipmentId);
    }

    public List<MaintenanceEntity> getMaintenancesByStatus(String status) {
        return repository.findByStatus(status);
    }

    public MaintenanceEntity saveMaintenance(MaintenanceEntity maintenance) {
        return repository.save(maintenance);
    }

    public Optional<MaintenanceEntity> updateMaintenance(String id, MaintenanceEntity updated) {
        return repository.findById(id).map(existing -> {
            existing.setDiagnostics(updated.getDiagnostics());
            existing.setSolution(updated.getSolution());
            existing.setCost(updated.getCost());
            existing.setStatus(updated.getStatus());
            existing.setEndDate(updated.getEndDate());
            existing.setFinalState(updated.getFinalState());
            existing.setTechnicianName(updated.getTechnicianName());
            return repository.save(existing);
        });
    }
}
