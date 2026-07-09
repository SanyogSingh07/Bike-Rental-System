package com.example.demo.bootstrap;

import com.example.demo.model.Bike;
import com.example.demo.model.Rental;
import com.example.demo.model.Station;
import com.example.demo.model.User;
import com.example.demo.repository.BikeRepository;
import com.example.demo.repository.RentalRepository;
import com.example.demo.repository.StationRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataBootstrapper implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BikeRepository bikeRepository;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private RentalRepository rentalRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only seed if db is empty
        if (userRepository.count() == 0) {
            System.out.println("Seeding H2 database with mock data...");

            // 1. Seed Users
            User admin = new User("admin", passwordEncoder.encode("admin123"), "admin@smartbike.com", "ROLE_ADMIN");
            userRepository.save(admin);

            User user = new User("user", passwordEncoder.encode("user123"), "user@gmail.com", "ROLE_USER");
            user.setLoyaltyPoints(250);
            user.setUserLevel("Silver Rider");
            user.setCo2Saved(15.6);
            userRepository.save(user);

            // 2. Seed Stations
            Station s1 = new Station("Downtown Station", 40.7128, -74.0060, 20, 5);
            Station s2 = new Station("Central Park Hub", 40.7829, -73.9654, 15, 4);
            Station s3 = new Station("Brooklyn Bridge Pier", 40.7061, -73.9969, 25, 6);
            Station s4 = new Station("Metropolitan Museum Plaza", 40.7794, -73.9632, 10, 3);
            Station s5 = new Station("Broadway Theater District", 40.7590, -73.9845, 30, 8);
            stationRepository.saveAll(List.of(s1, s2, s3, s4, s5));

            // 3. Seed Bikes
            Bike b1 = new Bike("e-Bike Pro 1", "Electric", 5.00, 85, "AVAILABLE", 40.7130, -74.0058, 
                    "Premium electric assist city bike with phone holder and basket.", 
                    "images/ather_450x.png");
            
            Bike b2 = new Bike("Mountain Rider X", "Mountain", 4.00, 100, "AVAILABLE", 40.7825, -73.9656, 
                    "Rugged mountain bike with front suspension and all-terrain tires.", 
                    "images/ola_roadster.png");
            
            Bike b3 = new Bike("Classic Cruiser", "Hybrid", 3.00, 100, "AVAILABLE", 40.7065, -73.9965, 
                    "Comfortable step-through hybrid cruiser bike for leisurely rides.", 
                    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500");
            
            Bike b4 = new Bike("Speedster Road 500", "Road", 6.00, 100, "AVAILABLE", 40.7796, -73.9630, 
                    "Ultra-lightweight aluminum frame road bike for high speed.", 
                    "images/triumph_speed.png");
            
            Bike b5 = new Bike("e-Scoot Spark", "Electric", 5.50, 45, "AVAILABLE", 40.7588, -73.9840, 
                    "High-speed electric bike, perfect for cross-town commutes.", 
                    "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500");
            
            Bike b6 = new Bike("Green Commuter", "Hybrid", 3.50, 100, "RENTED", 40.7200, -74.0100, 
                    "Sturdy commuting bike with rear rack and fenders.", 
                    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500");
            
            Bike b7 = new Bike("City Slicker", "Road", 4.50, 100, "MAINTENANCE", 40.7100, -74.0000, 
                    "Fast city road bike under maintenance check.", 
                    "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=500");

            bikeRepository.saveAll(List.of(b1, b2, b3, b4, b5, b6, b7));

            // 4. Seed Histories (completed rentals for user)
            Rental r1 = new Rental(user, b1, LocalDateTime.now().minusDays(1).minusHours(2));
            r1.setEndTime(LocalDateTime.now().minusDays(1).minusHours(1).minusMinutes(30));
            r1.setStatus("COMPLETED");
            r1.setTotalCost(150.00);
            r1.setDistanceTravelled(7.5);
            
            Rental r2 = new Rental(user, b3, LocalDateTime.now().minusDays(2).minusHours(3));
            r2.setEndTime(LocalDateTime.now().minusDays(2).minusHours(2).minusMinutes(45));
            r2.setStatus("COMPLETED");
            r2.setTotalCost(45.00);
            r2.setDistanceTravelled(3.75);

            rentalRepository.saveAll(List.of(r1, r2));

            System.out.println("Data seeding complete!");
        }
    }
}
