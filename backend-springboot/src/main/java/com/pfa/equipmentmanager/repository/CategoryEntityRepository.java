package com.pfa.equipmentmanager.repository;

import com.pfa.equipmentmanager.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CategoryEntityRepository extends JpaRepository<CategoryEntity, String> {
    Optional<CategoryEntity> findByCode(String code);
}
