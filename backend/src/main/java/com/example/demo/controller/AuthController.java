package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String email = request.get("email");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is already taken!"));
        }

        // Default role is ROLE_USER
        String role = "ROLE_USER";
        // Simple heuristic: if username contains "admin", give admin role
        if (username.toLowerCase().contains("admin")) {
            role = "ROLE_ADMIN";
        }

        User user = new User(username, passwordEncoder.encode(password), email, role);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        response.put("message", "User registered successfully!");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid username or password"));
        }

        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        response.put("message", "Logged in successfully!");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        // Refetch user to get the latest loyaltyPoints, etc.
        User latestUser = userRepository.findById(user.getId()).orElse(user);
        
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", latestUser.getId());
        profile.put("username", latestUser.getUsername());
        profile.put("email", latestUser.getEmail());
        profile.put("role", latestUser.getRole());
        profile.put("loyaltyPoints", latestUser.getLoyaltyPoints());
        profile.put("userLevel", latestUser.getUserLevel());
        profile.put("co2Saved", latestUser.getCo2Saved());
        return ResponseEntity.ok(profile);
    }
}
