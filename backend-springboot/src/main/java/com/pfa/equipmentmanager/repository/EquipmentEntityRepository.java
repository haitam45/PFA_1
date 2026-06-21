package com.pfa.equipmentmanager.repository;

import com.pfa.equipmentmanager.entity.EquipmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentEntityRepository extends JpaRepository<EquipmentEntity, String> {
    Optional<EquipmentEntity> findByCodeInventaire(String codeInventaire);
    List<EquipmentEntity> findByStatus(String status);
    List<EquipmentEntity> findByCategoryId(String categoryId);
}
