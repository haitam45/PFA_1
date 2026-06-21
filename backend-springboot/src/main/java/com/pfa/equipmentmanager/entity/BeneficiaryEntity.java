package com.pfa.equipmentmanager.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entité représentant un Bénéficiaire/Collaborateur.
 * Hérite de la classe UserEntity.
 */
@Entity
@DiscriminatorValue("BENEFICIAIRE")
@Getter
@Setter
@NoArgsConstructor
public class BeneficiaryEntity extends UserEntity {

    public BeneficiaryEntity(String id, String name, String email, String password, boolean isActive, String department, String room) {
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
        return Role.BENEFICIAIRE;
    }
}
