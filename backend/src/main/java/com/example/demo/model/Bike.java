package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bikes")
public class Bike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // Electric, Mountain, Road, Hybrid

    @Column(nullable = false)
    private double pricePerMinute;

    private int batteryPercentage = 100;

    @Column(nullable = false)
    private String status = "AVAILABLE"; // AVAILABLE, RENTED, MAINTENANCE

    private double latitude;
    private double longitude;
    private String description;
    private String imageUrl;

    public Bike() {}

    public Bike(String name, String type, double pricePerMinute, int batteryPercentage, String status, double latitude, double longitude, String description, String imageUrl) {
        this.name = name;
        this.type = type;
        this.pricePerMinute = pricePerMinute;
        this.batteryPercentage = batteryPercentage;
        this.status = status;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getPricePerMinute() { return pricePerMinute; }
    public void setPricePerMinute(double pricePerMinute) { this.pricePerMinute = pricePerMinute; }

    public int getBatteryPercentage() { return batteryPercentage; }
    public void setBatteryPercentage(int batteryPercentage) { this.batteryPercentage = batteryPercentage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
