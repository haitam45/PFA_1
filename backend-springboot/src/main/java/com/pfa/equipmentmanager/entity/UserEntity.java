package com.pfa.equipmentmanager.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Classe abstraite unique pour les Utilisateurs.
 * Sert de base pour tous les rôles spécifiques (Administrateur, Gestionnaire, Technicien, Bénéficiaire).
 */
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "role", discriminatorType = DiscriminatorType.STRING)
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.EXISTING_PROPERTY,
    property = "role",
    visible = true
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = AdminEntity.class, name = "ADMINISTRATEUR"),
    @JsonSubTypes.Type(value = ManagerEntity.class, name = "GESTIONNAIRE"),
    @JsonSubTypes.Type(value = TechnicianEntity.class, name = "TECHNICIEN"),
    @JsonSubTypes.Type(value = BeneficiaryEntity.class, name = "BENEFICIAIRE")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class UserEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password = "user123";

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "role", insertable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String room;

    /**
     * Chaque sous-classe concrète renvoie son rôle spécifique.
     */
    @JsonProperty("role")
    public abstract Role getRole();

    // Setter pour garder la compatibilité avec l'ancien code d'update
    public void setRole(Role role) {
        this.role = role;
    }
}
