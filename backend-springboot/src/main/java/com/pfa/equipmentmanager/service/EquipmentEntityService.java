package com.pfa.equipmentmanager.service;

import com.pfa.equipmentmanager.entity.EquipmentEntity;
import com.pfa.equipmentmanager.repository.EquipmentEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EquipmentEntityService {

    private final EquipmentEntityRepository equipmentRepository;

    public EquipmentEntityService(EquipmentEntityRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    public List<EquipmentEntity> getAllEquipments() {
        return equipmentRepository.findAll();
    }

    public Optional<EquipmentEntity> getEquipmentById(String id) {
        return equipmentRepository.findById(id);
    }

    public Optional<EquipmentEntity> getEquipmentByCode(String codeInventaire) {
        return equipmentRepository.findByCodeInventaire(codeInventaire);
    }

    public List<EquipmentEntity> getEquipmentsByStatus(String status) {
        return equipmentRepository.findByStatus(status);
    }

    public List<EquipmentEntity> getEquipmentsByCategoryId(String categoryId) {
        return equipmentRepository.findByCategoryId(categoryId);
    }

    public EquipmentEntity saveEquipment(EquipmentEntity equipment) {
        return equipmentRepository.save(equipment);
    }

    public Optional<EquipmentEntity> updateEquipment(String id, EquipmentEntity updated) {
        return equipmentRepository.findById(id).map(existing -> {
            existing.setCodeInventaire(updated.getCodeInventaire());
            existing.setSerialNumber(updated.getSerialNumber());
            existing.setCategoryId(updated.getCategoryId());
            existing.setBrand(updated.getBrand());
            existing.setModel(updated.getModel());
            existing.setPurchaseDate(updated.getPurchaseDate());
            existing.setPurchasePrice(updated.getPurchasePrice());
            existing.setProvider(updated.getProvider());
            existing.setWarrantyMonths(updated.getWarrantyMonths());
            existing.setStatus(updated.getStatus());
            existing.setState(updated.getState());
            existing.setLocation(updated.getLocation());
            existing.setComment(updated.getComment());
            return equipmentRepository.save(existing);
        });
    }

    public void deleteEquipment(String id) {
        equipmentRepository.deleteById(id);
    }
}
