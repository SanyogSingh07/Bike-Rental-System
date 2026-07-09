package com.example.demo.repository;

import com.example.demo.model.Bike;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BikeRepository extends JpaRepository<Bike, Long> {
    List<Bike> findByStatus(String status);
}
