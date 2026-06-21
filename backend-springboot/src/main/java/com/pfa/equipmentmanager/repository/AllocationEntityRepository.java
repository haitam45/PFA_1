package com.pfa.equipmentmanager.repository;

import com.pfa.equipmentmanager.entity.AllocationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AllocationEntityRepository extends JpaRepository<AllocationEntity, String> {
    List<AllocationEntity> findByEquipmentId(String equipmentId);
    List<AllocationEntity> findByStatus(String status);
}
