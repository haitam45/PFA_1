package com.pfa.equipmentmanager.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entité représentant un Technicien de Maintenance.
 * Hérite de la classe UserEntity.
 */
@Entity
@DiscriminatorValue("TECHNICIEN")
@Getter
@Setter
@NoArgsConstructor
public class TechnicianEntity extends UserEntity {

    public TechnicianEntity(String id, String name, String email, String password, boolean isActive, String department, String room) {
        this.setId(id);
        this.setName(name);
        this.setEmail(email);
        this.setPassword(password);
        this.setActive(isActive);
        this.setDepartment(department);
        this.setRoom(room);
    }

    @Override
    public Role getRole() {
        return Role.TECHNICIEN;
    }
}
