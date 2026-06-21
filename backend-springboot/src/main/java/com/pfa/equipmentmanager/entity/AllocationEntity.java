package com.pfa.equipmentmanager.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entité JPA pour l'affectation / allocation d'un équipement informatique.
 */
@Entity
@Table(name = "allocations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AllocationEntity {

    @Id
    private String id;

    @Column(name = "equipment_id", nullable = false)
    private String equipmentId;

    @Column(name = "equipment_code", nullable = false)
    private String equipmentCode;

    @Column(name = "equipment_model", nullable = false)
    private String equipmentModel;

    @Column(name = "beneficiary_id", nullable = false)
    private String beneficiaryId;

    @Column(name = "beneficiary_type", nullable = false, length = 50)
    private String beneficiaryType; // Utilisateur, Service, Salle

    @Column(name = "beneficiary_name", nullable = false)
    private String beneficiaryName;

    @Column(name = "allocated_date", nullable = false, length = 50)
    private String allocatedDate;

    @Column(name = "returned_date", length = 50)
    private String returnedDate;

    @Column(name = "responsable_name", nullable = false)
    private String responsableName;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false, length = 50)
    private String status; // En cours, Clôturée
}
