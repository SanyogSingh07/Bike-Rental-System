const API_BASE = "http://localhost:8080";

// Auth Helpers
function getToken() {
    return localStorage.getItem("token");
}

function setToken(token) {
    localStorage.setItem("token", token);
}

function getUsername() {
    return localStorage.getItem("username");
}

function setUsername(username) {
    localStorage.setItem("username", username);
}

function getRole() {
    return localStorage.getItem("role");
}

function setRole(role) {
    localStorage.setItem("role", role);
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    showToast("Logged out successfully!", "success");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}

// Check Authentication
function checkAuth() {
    const token = getToken();
    const currentPage = window.location.pathname.split("/").pop();
    
    // If not logged in and not on login page, redirect
    if (!token && currentPage !== "login.html" && currentPage !== "index.html" && currentPage !== "stations.html" && currentPage !== "") {
        window.location.href = "login.html";
    }
}

// Fetch helper with JWT header
async function apiRequest(endpoint, method = "GET", body = null) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        
        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            window.location.href = "login.html";
            return null;
        }

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || `Request failed with status ${response.status}`);
        }

        return await response.json().catch(() => ({}));
    } catch (error) {
        console.error("API Request Error:", error);
        throw error;
    }
}

// Toast Notification System
function showToast(message, type = "info") {
    // Create container if not exists
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    // Create toast
    const toast = document.createElement("div");
    toast.className = "toast";
    
    let iconClass = "fa-info-circle";
    let borderStyle = "#06b6d4"; // Teal

    if (type === "success") {
        iconClass = "fa-check-circle";
        borderStyle = "#10b981"; // Green
    } else if (type === "warning") {
        iconClass = "fa-exclamation-triangle";
        borderStyle = "#f59e0b"; // Orange
    } else if (type === "error") {
        iconClass = "fa-times-circle";
        borderStyle = "#ef4444"; // Red
    }

    toast.style.borderLeftColor = borderStyle;
    toast.innerHTML = `<i class="fas ${iconClass}" style="color: ${borderStyle}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = "slideIn 0.3s reverse forwards";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Theme Toggle Manager
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark"; // Default to dark mode for rich look
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.innerHTML = savedTheme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            themeBtn.innerHTML = newTheme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }
}

// Active Rental Check for global HUD banner
async function checkActiveRentalGlobal() {
    const token = getToken();
    if (!token) return;

    try {
        const activeRide = await apiRequest("/rental/active");
        const currentPage = window.location.pathname.split("/").pop();

        if (activeRide && activeRide.id && currentPage !== "ride-status.html") {
            // User has an active rental! Inject a floating banner
            let banner = document.getElementById("global-active-ride-banner");
            if (!banner) {
                banner = document.createElement("a");
                banner.id = "global-active-ride-banner";
                banner.className = "active-ride-pulsing container";
                banner.href = "ride-status.html";
                banner.style.position = "sticky";
                banner.style.top = "60px";
                banner.style.zIndex = "98";
                banner.style.display = "flex";
                banner.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="pulse-dot"></div>
                        <div>
                            <strong style="color: var(--text-primary);">Active Ride Running</strong>
                            <p style="font-size: 12px; margin: 0; color: var(--text-secondary);">Tap to view live timer and cost</p>
                        </div>
                    </div>
                    <i class="fas fa-chevron-right" style="color: var(--success-color);"></i>
                `;
                // Inject after header
                const header = document.querySelector("header");
                if (header) {
                    header.after(banner);
                } else {
                    document.body.prepend(banner);
                }
            }
        } else {
            const banner = document.getElementById("global-active-ride-banner");
            if (banner) banner.remove();
        }
    } catch (e) {
        console.error("Failed to check active rental:", e);
    }
}

// On DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    initTheme();
    checkActiveRentalGlobal();

    // Setup Admin Button Visibility
    const adminLink = document.getElementById("admin-nav-link");
    if (adminLink) {
        if (getRole() === "ROLE_ADMIN") {
            adminLink.style.display = "flex";
        } else {
            adminLink.style.display = "none";
        }
    }
});
