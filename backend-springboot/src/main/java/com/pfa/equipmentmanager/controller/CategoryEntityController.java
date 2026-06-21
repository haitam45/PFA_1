package com.pfa.equipmentmanager.controller;

import com.pfa.equipmentmanager.entity.CategoryEntity;
import com.pfa.equipmentmanager.service.CategoryEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryEntityController {

    private final CategoryEntityService service;

    public CategoryEntityController(CategoryEntityService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CategoryEntity>> getAllCategories() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    @PostMapping
    public ResponseEntity<CategoryEntity> createCategory(@RequestBody CategoryEntity category) {
        return ResponseEntity.ok(service.saveCategory(category));
    }
}
