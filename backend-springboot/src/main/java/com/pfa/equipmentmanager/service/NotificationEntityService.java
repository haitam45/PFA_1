package com.pfa.equipmentmanager.service;

import com.pfa.equipmentmanager.entity.NotificationEntity;
import com.pfa.equipmentmanager.repository.NotificationEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationEntityService {

    private final NotificationEntityRepository repository;

    public NotificationEntityService(NotificationEntityRepository repository) {
        this.repository = repository;
    }

    public List<NotificationEntity> getAllNotifications() {
        return repository.findAll();
    }

    public List<NotificationEntity> getNotificationsForRole(String role) {
        return repository.findByRecipientRoleOrRecipientRole(role, "ALL");
    }

    public NotificationEntity saveNotification(NotificationEntity notification) {
        return repository.save(notification);
    }

    public Optional<NotificationEntity> markAsRead(String id) {
        return repository.findById(id).map(notif -> {
            notif.setRead(true);
            return repository.save(notif);
        });
    }

    public void clearAll() {
        repository.deleteAll();
    }
}
