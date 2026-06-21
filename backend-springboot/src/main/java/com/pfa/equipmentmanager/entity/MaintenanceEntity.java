package com.pfa.equipmentmanager.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * Entité JPA des dossiers de maintenance d'équipements en panne.
 */
@Entity
@Table(name = "maintenances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceEntity {

    @Id
    private String id;

    @Column(name = "equipment_id", nullable = false)
    private String equipmentId;

    @Column(name = "equipment_code", nullable = false)
    private String equipmentCode;

    @Column(name = "equipment_model", nullable = false)
    private String equipmentModel;

    @Column(name = "reported_date", nullable = false, length = 50)
    private String reportedDate;

    @Column(name = "failure_description", nullable = false, columnDefinition = "TEXT")
    private String failureDescription;

    @Column(columnDefinition = "TEXT")
    private String diagnostics;

    @Column(columnDefinition = "TEXT")
    private String solution;

    @Column(precision = 12, scale = 2)
    private BigDecimal cost;

    @Column(nullable = false, length = 50)
    private String status; // Déclarante, En cours, Clôturée

    @Column(name = "technician_name", nullable = false)
    private String technicianName;

    @Column(name = "end_date", length = 50)
    private String endDate;

    @Column(name = "final_state", length = 50)
    private String finalState; // Excellent, Bon, Moyen, En panne, Hors-service
}
