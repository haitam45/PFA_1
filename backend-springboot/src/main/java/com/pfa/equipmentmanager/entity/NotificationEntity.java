package com.pfa.equipmentmanager.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entité JPA pour les notifications ciblées par rôle.
 */
@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEntity {

    @Id
    private String id;

    @Column(nullable = false, length = 50)
    private String timestamp;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "recipient_role", nullable = false, length = 100)
    private String recipientRole; // ADMINISTRATEUR, GESTIONNAIRE, TECHNICIEN, BENEFICIAIRE, ALL

    @Builder.Default
    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(nullable = false, length = 50)
    private String type; // allocation, restitution, breakdown, maintenance, system

    @Column(name = "equipment_code")
    private String equipmentCode;
}
