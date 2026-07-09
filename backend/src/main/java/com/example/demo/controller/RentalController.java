package com.example.demo.controller;

import com.example.demo.model.Rental;
import com.example.demo.model.User;
import com.example.demo.repository.RentalRepository;
import com.example.demo.service.RentalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class RentalController {

    @Autowired
    private RentalService rentalService;

    @Autowired
    private RentalRepository rentalRepository;

    @PostMapping("/rent")
    public ResponseEntity<?> rentBike(@AuthenticationPrincipal User user, @RequestBody Map<String, Long> request) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        Long bikeId = request.get("bikeId");
        if (bikeId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "bikeId is required"));
        }
        try {
            Rental rental = rentalService.rentBike(user, bikeId);
            return ResponseEntity.ok(rental);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/return")
    public ResponseEntity<?> returnBike(@AuthenticationPrincipal User user, @RequestBody Map<String, Double> request) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        Double latitude = request.get("latitude");
        Double longitude = request.get("longitude");
        if (latitude == null || longitude == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "latitude and longitude are required"));
        }
        try {
            Rental rental = rentalService.returnBike(user, latitude, longitude);
            return ResponseEntity.ok(rental);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        List<Rental> history = rentalRepository.findByUserOrderByStartTimeDesc(user);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/rental/active")
    public ResponseEntity<?> getActiveRental(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        return rentalRepository.findByUserAndStatus(user, "ACTIVE")
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(Map.of("active", false)));
    }
}
