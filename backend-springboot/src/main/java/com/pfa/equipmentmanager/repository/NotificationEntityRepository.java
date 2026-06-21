package com.pfa.equipmentmanager.repository;

import com.pfa.equipmentmanager.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationEntityRepository extends JpaRepository<NotificationEntity, String> {
    List<NotificationEntity> findByRecipientRoleOrRecipientRole(String role, String allRole);
}
