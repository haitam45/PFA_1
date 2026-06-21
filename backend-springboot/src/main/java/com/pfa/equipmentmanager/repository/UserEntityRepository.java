package com.pfa.equipmentmanager.repository;

import com.pfa.equipmentmanager.entity.UserEntity;
import com.pfa.equipmentmanager.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserEntityRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "UPDATE users SET role = :#{#role.name()} WHERE id = :id", nativeQuery = true)
    void updateRole(@Param("id") String id, @Param("role") Role role);

    List<UserEntity> findByRoleAndIsActive(Role role, boolean isActive);
    List<UserEntity> findByRole(Role role);
}
