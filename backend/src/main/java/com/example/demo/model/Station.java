package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "stations")
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private double latitude;
    private double longitude;
    private int totalSlots;
    private int availableBikes;

    public Station() {}

    public Station(String name, double latitude, double longitude, int totalSlots, int availableBikes) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.totalSlots = totalSlots;
        this.availableBikes = availableBikes;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public int getTotalSlots() { return totalSlots; }
    public void setTotalSlots(int totalSlots) { this.totalSlots = totalSlots; }

    public int getAvailableBikes() { return availableBikes; }
    public void setAvailableBikes(int availableBikes) { this.availableBikes = availableBikes; }
}
