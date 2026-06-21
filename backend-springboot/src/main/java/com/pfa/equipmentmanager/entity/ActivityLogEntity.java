package com.pfa.equipmentmanager.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entité JPA pour enregistrer les audits logs et historiques des actions.
 */
@Entity
@Table(name = "activity_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLogEntity {

    @Id
    private String id;

    @Column(nullable = false, length = 50)
    private String timestamp;

    @Column(name = "operator_name", nullable = false)
    private String operatorName;

    @Column(name = "operator_role", nullable = false, length = 100)
    private String operatorRole;

    @Column(name = "action_type", nullable = false, length = 100)
    private String actionType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "equipment_id")
    private String equipmentId;

    @Column(name = "equipment_code")
    private String equipmentCode;
}
