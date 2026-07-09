package com.example.demo.controller;

import com.example.demo.model.Bike;
import com.example.demo.model.Rental;
import com.example.demo.model.User;
import com.example.demo.repository.BikeRepository;
import com.example.demo.repository.RentalRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BikeRepository bikeRepository;

    @Autowired
    private RentalRepository rentalRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardMetrics(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        if (!"ROLE_ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied. Admins only."));
        }

        long totalUsers = userRepository.count();
        long totalBikes = bikeRepository.count();
        long bikesAvailable = bikeRepository.findByStatus("AVAILABLE").size();
        long bikesRented = bikeRepository.findByStatus("RENTED").size();
        long bikesMaintenance = bikeRepository.findByStatus("MAINTENANCE").size();

        List<Rental> allRentals = rentalRepository.findAll();
        long activeRentalsCount = rentalRepository.findByStatus("ACTIVE").size();

        double totalRevenue = 0.0;
        long totalDurationMinutes = 0;
        long completedRidesCount = 0;
        Map<String, Integer> typeCount = new HashMap<>();

        for (Rental rental : allRentals) {
            totalRevenue += rental.getTotalCost();
            if ("COMPLETED".equals(rental.getStatus())) {
                completedRidesCount++;
                long duration = java.time.Duration.between(rental.getStartTime(), rental.getEndTime()).toMinutes();
                totalDurationMinutes += duration;
            }
            String bikeType = rental.getBike().getType();
            typeCount.put(bikeType, typeCount.getOrDefault(bikeType, 0) + 1);
        }

        double avgDuration = completedRidesCount == 0 ? 0.0 : (double) totalDurationMinutes / completedRidesCount;

        String mostPopularType = "None";
        int maxRides = 0;
        for (Map.Entry<String, Integer> entry : typeCount.entrySet()) {
            if (entry.getValue() > maxRides) {
                maxRides = entry.getValue();
                mostPopularType = entry.getKey();
            }
        }

        // Prepare chart data
        // 1. Revenue trend: past 7 days
        List<Map<String, Object>> revenueTrend = new ArrayList<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        double[] mockRevenue = {120.50, 150.00, 95.00, 180.20, 220.00, 310.50, totalRevenue};
        for (int i = 0; i < days.length; i++) {
            revenueTrend.add(Map.of("label", days[i], "value", mockRevenue[i]));
        }

        // 2. Daily rentals: past 7 days
        List<Map<String, Object>> dailyRentals = new ArrayList<>();
        int[] mockRentals = {24, 30, 18, 35, 45, 60, allRentals.size()};
        for (int i = 0; i < days.length; i++) {
            dailyRentals.add(Map.of("label", days[i], "value", mockRentals[i]));
        }

        // 3. Bike category distribution
        List<Map<String, Object>> categoryDistribution = new ArrayList<>();
        List<Bike> allBikesList = bikeRepository.findAll();
        Map<String, Integer> catCounts = new HashMap<>();
        for (Bike b : allBikesList) {
            catCounts.put(b.getType(), catCounts.getOrDefault(b.getType(), 0) + 1);
        }
        for (Map.Entry<String, Integer> entry : catCounts.entrySet()) {
            categoryDistribution.add(Map.of("category", entry.getKey(), "count", entry.getValue()));
        }

        // 4. User growth: past 5 months
        List<Map<String, Object>> userGrowth = new ArrayList<>();
        String[] months = {"Feb", "Mar", "Apr", "May", "Jun"};
        int[] userCounts = {12, 28, 45, 80, (int) totalUsers};
        for (int i = 0; i < months.length; i++) {
            userGrowth.add(Map.of("label", months[i], "value", userCounts[i]));
        }

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalUsers", totalUsers);
        metrics.put("totalBikes", totalBikes);
        metrics.put("bikesAvailable", bikesAvailable);
        metrics.put("bikesRented", bikesRented);
        metrics.put("bikesMaintenance", bikesMaintenance);
        metrics.put("totalRevenue", totalRevenue);
        metrics.put("activeRentals", activeRentalsCount);
        metrics.put("averageRideDuration", avgDuration);
        metrics.put("mostPopularBike", mostPopularType);
        metrics.put("peakRentalHours", "08:00 - 10:00, 17:00 - 19:00");

        // Charts data
        metrics.put("revenueTrend", revenueTrend);
        metrics.put("dailyRentals", dailyRentals);
        metrics.put("categoryDistribution", categoryDistribution);
        metrics.put("userGrowth", userGrowth);

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        if (!"ROLE_ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied. Admins only."));
        }
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/bike")
    public ResponseEntity<?> addBike(@AuthenticationPrincipal User user, @RequestBody Bike bike) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        if (!"ROLE_ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied. Admins only."));
        }
        if (bike.getStatus() == null) {
            bike.setStatus("AVAILABLE");
        }
        Bike saved = bikeRepository.save(bike);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/bike/{id}")
    public ResponseEntity<?> updateBike(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestBody Bike bikeDetails) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        if (!"ROLE_ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied. Admins only."));
        }

        Bike bike = bikeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bike not found"));

        bike.setName(bikeDetails.getName());
        bike.setType(bikeDetails.getType());
        bike.setPricePerMinute(bikeDetails.getPricePerMinute());
        bike.setBatteryPercentage(bikeDetails.getBatteryPercentage());
        bike.setStatus(bikeDetails.getStatus());
        bike.setLatitude(bikeDetails.getLatitude());
        bike.setLongitude(bikeDetails.getLongitude());
        bike.setDescription(bikeDetails.getDescription());
        bike.setImageUrl(bikeDetails.getImageUrl());

        Bike updated = bikeRepository.save(bike);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/bike/{id}")
    public ResponseEntity<?> deleteBike(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        if (!"ROLE_ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied. Admins only."));
        }

        Bike bike = bikeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bike not found"));

        bikeRepository.delete(bike);
        return ResponseEntity.ok(Map.of("message", "Bike deleted successfully!"));
    }
}
