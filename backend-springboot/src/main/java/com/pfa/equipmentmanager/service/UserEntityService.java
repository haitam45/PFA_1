package com.pfa.equipmentmanager.service;

import com.pfa.equipmentmanager.entity.UserEntity;
import com.pfa.equipmentmanager.entity.Role;
import com.pfa.equipmentmanager.repository.UserEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class UserEntityService {

    private final UserEntityRepository userRepository;

    public UserEntityService(UserEntityRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<UserEntity> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<UserEntity> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<UserEntity> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public List<UserEntity> getActiveUsersByRole(Role role) {
        return userRepository.findByRoleAndIsActive(role, true);
    }

    public UserEntity saveUser(UserEntity user) {
        return userRepository.save(user);
    }

    @Transactional
    public Optional<UserEntity> updateUser(String id, UserEntity updatedDetails) {
        return userRepository.findById(id).map(user -> {
            user.setName(updatedDetails.getName());
            user.setEmail(updatedDetails.getEmail());
            user.setDepartment(updatedDetails.getDepartment());
            user.setRoom(updatedDetails.getRoom());
            user.setActive(updatedDetails.isActive());
            if (updatedDetails.getPassword() != null && !updatedDetails.getPassword().isBlank()) {
                user.setPassword(updatedDetails.getPassword());
            }

            // Check if the role was modified and invoke state change native query
            Role oldRole = user.getRole();
            Role newRole = updatedDetails.getRole();
            if (oldRole != newRole && newRole != null) {
                userRepository.updateRole(id, newRole);
            }

            return userRepository.save(user);
        });
    }

    public Optional<UserEntity> toggleUserStatus(String id) {
        return userRepository.findById(id).map(user -> {
            user.setActive(!user.isActive());
            return userRepository.save(user);
        });
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
