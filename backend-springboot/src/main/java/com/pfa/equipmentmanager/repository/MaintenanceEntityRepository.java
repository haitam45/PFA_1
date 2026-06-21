package com.pfa.equipmentmanager.repository;

import com.pfa.equipmentmanager.entity.MaintenanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceEntityRepository extends JpaRepository<MaintenanceEntity, String> {
    List<MaintenanceEntity> findByEquipmentId(String equipmentId);
    List<MaintenanceEntity> findByStatus(String status);
}
