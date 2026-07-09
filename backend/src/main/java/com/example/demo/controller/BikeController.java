package com.example.demo.controller;

import com.example.demo.model.Bike;
import com.example.demo.model.User;
import com.example.demo.repository.BikeRepository;
import com.example.demo.service.BikeRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin
public class BikeController {

    @Autowired
    private BikeRepository bikeRepository;

    @Autowired
    private BikeRecommendationService recommendationService;

    @GetMapping("/bikes")
    public List<Map<String, Object>> getAllBikes(@RequestParam(required = false) Double lat,
                                                 @RequestParam(required = false) Double lng) {
        List<Bike> bikes = bikeRepository.findAll();
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Bike bike : bikes) {
            Map<String, Object> bikeMap = new HashMap<>();
            bikeMap.put("id", bike.getId());
            bikeMap.put("name", bike.getName());
            bikeMap.put("type", bike.getType());
            bikeMap.put("pricePerMinute", bike.getPricePerMinute());
            bikeMap.put("batteryPercentage", bike.getBatteryPercentage());
            bikeMap.put("status", bike.getStatus());
            bikeMap.put("latitude", bike.getLatitude());
            bikeMap.put("longitude", bike.getLongitude());
            bikeMap.put("description", bike.getDescription());
            bikeMap.put("imageUrl", bike.getImageUrl());

            if (lat != null && lng != null) {
                double dist = calculateDistance(lat, lng, bike.getLatitude(), bike.getLongitude());
                bikeMap.put("distance", dist);
            } else {
                bikeMap.put("distance", 0.0);
            }
            responseList.add(bikeMap);
        }
        return responseList;
    }

    @GetMapping("/bike/{id}")
    public ResponseEntity<?> getBikeById(@PathVariable Long id) {
        return bikeRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/recommendation")
    public ResponseEntity<?> getRecommendation(@AuthenticationPrincipal User user,
                                               @RequestParam double lat,
                                               @RequestParam double lng) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        Map<String, Object> recommendation = recommendationService.getRecommendation(user, lat, lng);
        return ResponseEntity.ok(recommendation);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }
}
