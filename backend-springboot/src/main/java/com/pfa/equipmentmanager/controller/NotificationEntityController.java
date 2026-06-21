package com.pfa.equipmentmanager.controller;

import com.pfa.equipmentmanager.entity.NotificationEntity;
import com.pfa.equipmentmanager.service.NotificationEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationEntityController {

    private final NotificationEntityService service;

    public NotificationEntityController(NotificationEntityService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<NotificationEntity>> getAllNotifications() {
        return ResponseEntity.ok(service.getAllNotifications());
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<NotificationEntity>> getForRole(@PathVariable String role) {
        return ResponseEntity.ok(service.getNotificationsForRole(role));
    }

    @PostMapping
    public ResponseEntity<NotificationEntity> createNotification(@RequestBody NotificationEntity notification) {
        return ResponseEntity.ok(service.saveNotification(notification));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationEntity> markAsRead(@PathVariable String id) {
        return service.markAsRead(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping
    public ResponseEntity<?> clearAll() {
        service.clearAll();
        return ResponseEntity.ok(Map.of("message", "Toutes les notifications ont été effacées."));
    }
}
