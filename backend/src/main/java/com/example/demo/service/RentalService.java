package com.example.demo.service;

import com.example.demo.model.Bike;
import com.example.demo.model.Rental;
import com.example.demo.model.User;
import com.example.demo.repository.BikeRepository;
import com.example.demo.repository.RentalRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class RentalService {

    @Autowired
    private RentalRepository rentalRepository;

    @Autowired
    private BikeRepository bikeRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Rental rentBike(User user, Long bikeId) {
        // 1. Check if user already has an active rental
        Optional<Rental> activeRental = rentalRepository.findByUserAndStatus(user, "ACTIVE");
        if (activeRental.isPresent()) {
            throw new RuntimeException("You already have an active rental. Please return it first.");
        }

        // 2. Fetch bike and verify availability
        Bike bike = bikeRepository.findById(bikeId)
                .orElseThrow(() -> new RuntimeException("Bike not found"));
        if (!"AVAILABLE".equals(bike.getStatus())) {
            throw new RuntimeException("Bike is not available for rent.");
        }

        // 3. Update bike status and create rental
        bike.setStatus("RENTED");
        bikeRepository.save(bike);

        Rental rental = new Rental(user, bike, LocalDateTime.now());
        return rentalRepository.save(rental);
    }

    @Transactional
    public Rental returnBike(User user, double endLat, double endLng) {
        // 1. Fetch active rental
        Rental rental = rentalRepository.findByUserAndStatus(user, "ACTIVE")
                .orElseThrow(() -> new RuntimeException("No active rental found for this user."));

        Bike bike = rental.getBike();
        LocalDateTime endTime = LocalDateTime.now();
        rental.setEndTime(endTime);
        rental.setStatus("COMPLETED");

        // 2. Calculate duration (minutes)
        long minutes = Duration.between(rental.getStartTime(), endTime).toMinutes();
        if (minutes < 1) {
            minutes = 1; // Minimum charge 1 minute
        }

        // 3. Calculate cost
        double totalCost = minutes * bike.getPricePerMinute();
        rental.setTotalCost(totalCost);

        // 4. Calculate simulated distance (avg speed of 15 km/h = 0.25 km per minute)
        double distance = minutes * 0.25;
        rental.setDistanceTravelled(distance);

        // 5. Update bike status, coordinates, and battery
        bike.setStatus("AVAILABLE");
        bike.setLatitude(endLat);
        bike.setLongitude(endLng);
        // Decrease battery slightly (e.g. 2% per minute of ride, minimum 10%)
        int newBattery = Math.max(10, bike.getBatteryPercentage() - (int) (minutes * 2));
        bike.setBatteryPercentage(newBattery);
        bikeRepository.save(bike);

        // 6. Update user rewards
        // 10 base points + 2 points per minute
        int pointsEarned = 10 + (int) (minutes * 2);
        user.setLoyaltyPoints(user.getLoyaltyPoints() + pointsEarned);

        // 0.21 kg CO2 saved per km cycled instead of driving
        double co2SavedEarned = distance * 0.21;
        user.setCo2Saved(user.getCo2Saved() + co2SavedEarned);

        // Update Level
        int totalPoints = user.getLoyaltyPoints();
        if (totalPoints > 600) {
            user.setUserLevel("Platinum Rider");
        } else if (totalPoints > 300) {
            user.setUserLevel("Gold Rider");
        } else if (totalPoints > 100) {
            user.setUserLevel("Silver Rider");
        } else {
            user.setUserLevel("Bronze Rider");
        }
        userRepository.save(user);

        return rentalRepository.save(rental);
    }
}
