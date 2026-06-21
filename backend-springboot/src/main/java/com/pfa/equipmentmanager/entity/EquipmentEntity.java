package com.pfa.equipmentmanager.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * Entité JPA pour les matériels du parc informatique.
 */
@Entity
@Table(name = "equipments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentEntity {

    @Id
    private String id;

    @Column(name = "code_inventaire", nullable = false, unique = true)
    private String codeInventaire;

    @Column(name = "serial_number", nullable = false)
    private String serialNumber;

    @Column(name = "category_id", nullable = false)
    private String categoryId;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(name = "purchase_date", nullable = false, length = 50)
    private String purchaseDate;

    @Column(name = "purchase_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal purchasePrice;

    @Column(nullable = false)
    private String provider;

    @Column(name = "warranty_months", nullable = false)
    private int warrantyMonths;

    @Column(nullable = false, length = 50)
    private String status; // Disponible, Affecté, En maintenance, Mis au rebut

    @Column(nullable = false, length = 50)
    private String state; // Excellent, Bon, Moyen, En panne, Hors-service

    @Column(nullable = false)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String comment;
}
