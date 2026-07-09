package com.example.demo.repository;

import com.example.demo.model.Rental;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByUserOrderByStartTimeDesc(User user);
    Optional<Rental> findByUserAndStatus(User user, String status);
    List<Rental> findByStatus(String status);
}
