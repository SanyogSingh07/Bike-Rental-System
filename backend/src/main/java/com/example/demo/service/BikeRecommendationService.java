package com.example.demo.service;

import com.example.demo.model.Bike;
import com.example.demo.model.Rental;
import com.example.demo.model.User;
import com.example.demo.repository.BikeRepository;
import com.example.demo.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BikeRecommendationService {

    @Autowired
    private BikeRepository bikeRepository;

    @Autowired
    private RentalRepository rentalRepository;

    // Haversine distance formula
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radious of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    public Map<String, Object> getRecommendation(User user, double userLat, double userLng) {
        List<Bike> availableBikes = bikeRepository.findByStatus("AVAILABLE");
        Map<String, Object> result = new HashMap<>();

        // 1. Simulate weather
        String[] weathers = {"Sunny (25°C)", "Windy (18°C)", "Overcast (20°C)", "Mild (22°C)"};
        // Use a stable weather based on current hour to avoid flipping on every refresh
        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        String weather = weathers[hour % weathers.length];
        result.put("weather", weather);

        if (availableBikes.isEmpty()) {
            result.put("recommendationMessage", "No bikes are currently available near you. Please check back later.");
            result.put("recommendedBike", null);
            return result;
        }

        // 2. Analyze user's history
        List<Rental> history = rentalRepository.findByUserOrderByStartTimeDesc(user);
        Map<String, Integer> typeFrequency = new HashMap<>();
        for (Rental r : history) {
            String type = r.getBike().getType();
            typeFrequency.put(type, typeFrequency.getOrDefault(type, 0) + 1);
        }

        String preferredType = "Electric"; // Default preference
        int maxCount = 0;
        for (Map.Entry<String, Integer> entry : typeFrequency.entrySet()) {
            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                preferredType = entry.getKey();
            }
        }

        // 3. Select best bike
        Bike recommendedBike = null;
        double bestScore = -Double.MAX_VALUE;

        for (Bike bike : availableBikes) {
            double distance = calculateDistance(userLat, userLng, bike.getLatitude(), bike.getLongitude());
            
            // Score components (higher is better)
            // Weight 1: Distance (closer is better). Subtract distance * 5
            double distanceScore = -distance * 5.0;

            // Weight 2: Battery (higher is better). Electric bikes prioritize battery.
            double batteryScore = bike.getBatteryPercentage() / 10.0;

            // Weight 3: Match user preference
            double preferenceScore = bike.getType().equalsIgnoreCase(preferredType) ? 5.0 : 0.0;

            // Weight 4: Weather adjustments
            double weatherScore = 0.0;
            if (weather.contains("Windy") && bike.getType().equalsIgnoreCase("Electric")) {
                weatherScore = 4.0; // Electric helps in headwind
            } else if (weather.contains("Sunny") && bike.getType().equalsIgnoreCase("Road")) {
                weatherScore = 3.0; // Sunny weather is great for road biking
            }

            double totalScore = distanceScore + batteryScore + preferenceScore + weatherScore;

            if (totalScore > bestScore) {
                bestScore = totalScore;
                recommendedBike = bike;
            }
        }

        result.put("recommendedBike", recommendedBike);

        // 4. Generate recommendation message
        if (recommendedBike != null) {
            String message = String.format("Based on today's %s weather and your preference for %s bikes, we recommend the %s. It is an %s bike with %d%% battery, located just %.1f km away.",
                    weather.toLowerCase(),
                    preferredType,
                    recommendedBike.getName(),
                    recommendedBike.getType(),
                    recommendedBike.getBatteryPercentage(),
                    calculateDistance(userLat, userLng, recommendedBike.getLatitude(), recommendedBike.getLongitude())
            );
            result.put("recommendationMessage", message);
        } else {
            result.put("recommendationMessage", "We couldn't find a matching bike for you right now.");
        }

        return result;
    }
}
