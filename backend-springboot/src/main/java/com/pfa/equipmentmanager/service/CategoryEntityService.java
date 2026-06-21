package com.pfa.equipmentmanager.service;

import com.pfa.equipmentmanager.entity.CategoryEntity;
import com.pfa.equipmentmanager.repository.CategoryEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryEntityService {

    private final CategoryEntityRepository categoryRepository;

    public CategoryEntityService(CategoryEntityRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<CategoryEntity> getCategoryById(String id) {
        return categoryRepository.findById(id);
    }

    public CategoryEntity saveCategory(CategoryEntity category) {
        return categoryRepository.save(category);
    }
}
