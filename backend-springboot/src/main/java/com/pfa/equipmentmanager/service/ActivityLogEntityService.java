package com.pfa.equipmentmanager.service;

import com.pfa.equipmentmanager.entity.ActivityLogEntity;
import com.pfa.equipmentmanager.repository.ActivityLogEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ActivityLogEntityService {

    private final ActivityLogEntityRepository repository;

    public ActivityLogEntityService(ActivityLogEntityRepository repository) {
        this.repository = repository;
    }

    public List<ActivityLogEntity> getAllLogs() {
        return repository.findAll();
    }

    public List<ActivityLogEntity> getLogsByEquipment(String equipmentId) {
        return repository.findByEquipmentId(equipmentId);
    }

    public ActivityLogEntity saveLog(ActivityLogEntity log) {
        return repository.save(log);
    }
}
