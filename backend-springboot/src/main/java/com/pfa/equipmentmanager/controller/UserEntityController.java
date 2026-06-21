package com.pfa.equipmentmanager.controller;

import com.pfa.equipmentmanager.entity.UserEntity;
import com.pfa.equipmentmanager.service.UserEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * API REST pour gérer les collaborateurs (acteurs dynamiques).
 * Communique exclusivement par format JSON avec le frontend React.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserEntityController {

    private final UserEntityService userService;

    public UserEntityController(UserEntityService userService) {
        this.userService = userService;
    }

    // 1. Lister tous les collaborateurs
    @GetMapping
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // 2. Récupérer un collaborateur par son id
    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Ajouter un collaborateur
    @PostMapping
    public ResponseEntity<UserEntity> createUser(@RequestBody UserEntity user) {
        UserEntity created = userService.saveUser(user);
        return ResponseEntity.ok(created);
    }

    // 4. Mettre à jour les informations d'un collaborateur
    @PutMapping("/{id}")
    public ResponseEntity<UserEntity> updateUser(@PathVariable String id, @RequestBody UserEntity userDetails) {
        return userService.updateUser(id, userDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 5. Basculer le statut Actif/Inactif
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<UserEntity> toggleStatus(@PathVariable String id) {
        return userService.toggleUserStatus(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 6. Supprimer un collaborateur
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "Collaborateur supprimé avec succès"));
    }

    // 7. Authentification sécurisée de l'acteur (Pass-port)
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> credentials) {
        String emailOrId = credentials.get("username_or_email");
        String password = credentials.get("password");

        if (emailOrId == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Identifiant et mot de passe requis"));
        }

        Optional<UserEntity> userOpt = userService.getUserByEmail(emailOrId)
                .or(() -> userService.getUserById(emailOrId));

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Acteur non identifié dans le registre."));
        }

        UserEntity user = userOpt.get();
        if (!user.isActive()) {
            return ResponseEntity.status(401).body(Map.of("error", "Ce profil d'acteur est actuellement désactivé."));
        }

        if (!user.getPassword().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("error", "Code d'accès / Mot de passe incorrect."));
        }

        return ResponseEntity.ok(user);
    }
}
