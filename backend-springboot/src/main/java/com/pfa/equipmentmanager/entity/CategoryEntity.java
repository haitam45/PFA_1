package com.pfa.equipmentmanager.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entité JPA des catégories matérielles (Ordinateur, Écran, Imprimante, etc.).
 */
@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String icon;

    @Column(columnDefinition = "TEXT")
    private String description;
}
