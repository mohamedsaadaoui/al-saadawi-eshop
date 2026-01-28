package com.clothingstore.service;

import com.clothingstore.model.entity.Category;
import com.clothingstore.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    public Category updateCategory(Long id, Category details) {
        Category category = categoryRepository.findById(id).orElseThrow();
        category.setName(details.getName());
        category.setDescription(details.getDescription());
        return categoryRepository.save(category);
    }
}
