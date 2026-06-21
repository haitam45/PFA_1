package com.pfa.equipmentmanager.service;

import com.pfa.equipmentmanager.entity.AllocationEntity;
import com.pfa.equipmentmanager.repository.AllocationEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AllocationEntityService {

    private final AllocationEntityRepository allocationRepository;

    public AllocationEntityService(AllocationEntityRepository allocationRepository) {
        this.allocationRepository = allocationRepository;
    }

    public List<AllocationEntity> getAllAllocations() {
        return allocationRepository.findAll();
    }

    public Optional<AllocationEntity> getAllocationById(String id) {
        return allocationRepository.findById(id);
    }

    public List<AllocationEntity> getAllocationsByEquipment(String equipmentId) {
        return allocationRepository.findByEquipmentId(equipmentId);
    }

    public List<AllocationEntity> getActiveAllocations() {
        return allocationRepository.findByStatus("En cours");
    }

    public AllocationEntity saveAllocation(AllocationEntity allocation) {
         return allocationRepository.save(allocation);
    }

    public Optional<AllocationEntity> updateAllocation(String id, AllocationEntity updated) {
        return allocationRepository.findById(id).map(existing -> {
            existing.setReturnedDate(updated.getReturnedDate());
            existing.setNotes(updated.getNotes());
            existing.setStatus(updated.getStatus());
            return allocationRepository.save(existing);
        });
    }
}
