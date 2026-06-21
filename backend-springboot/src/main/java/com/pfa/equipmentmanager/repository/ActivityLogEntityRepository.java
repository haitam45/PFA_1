package com.pfa.equipmentmanager.repository;

import com.pfa.equipmentmanager.entity.ActivityLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityLogEntityRepository extends JpaRepository<ActivityLogEntity, String> {
    List<ActivityLogEntity> findByEquipmentId(String equipmentId);
}
