package com.example.demo.controller;

import com.example.demo.model.Station;
import com.example.demo.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
public class StationController {

    @Autowired
    private StationRepository stationRepository;

    @GetMapping("/stations")
    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }
}
