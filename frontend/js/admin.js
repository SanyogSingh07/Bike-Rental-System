// Admin Dashboard Logic

let revenueChart = null;
let categoryChart = null;
let rentalsChart = null;

document.addEventListener("DOMContentLoaded", () => {
    const adminMetrics = document.getElementById("admin-metrics-container");
    if (adminMetrics) {
        loadAdminDashboard();
        loadBikesTable();
        loadUsersTable();
    }

    // Bike CRUD form submission
    const bikeForm = document.getElementById("admin-bike-form");
    if (bikeForm) {
        bikeForm.addEventListener("submit", handleBikeFormSubmit);
    }
});

async function loadAdminDashboard() {
    try {
        const metrics = await apiRequest("/dashboard");
        if (!metrics) return;

        // Animate counter values
        animateCounter("metric-users", metrics.totalUsers);
        animateCounter("metric-bikes", metrics.totalBikes);
        animateCounter("metric-available", metrics.bikesAvailable);
        animateCounter("metric-rented", metrics.bikesRented);
        animateCounter("metric-revenue", metrics.totalRevenue, true);
        animateCounter("metric-duration", Math.round(metrics.averageRideDuration));

        // Render Chart.js charts
        renderCharts(metrics);
    } catch (e) {
        showToast("Access Denied or Error loading admin dashboard metrics", "error");
    }
}

function animateCounter(id, targetValue, isCurrency = false) {
    const el = document.getElementById(id);
    if (!el) return;

    let start = 0;
    const duration = 1000; // 1 second animation
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutQuad)
        const easeProgress = progress * (2 - progress);
        const currentValue = start + easeProgress * (targetValue - start);

        if (isCurrency) {
            el.textContent = `₹${currentValue.toFixed(2)}`;
        } else {
            el.textContent = Math.round(currentValue).toLocaleString();
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    requestAnimationFrame(updateCounter);
}

function renderCharts(metrics) {
    // 1. Revenue Trend (Line Chart)
    const revCtx = document.getElementById("revenue-chart");
    if (revCtx) {
        if (revenueChart) revenueChart.destroy();
        const labels = metrics.revenueTrend.map(d => d.label);
        const values = metrics.revenueTrend.map(d => d.value);

        revenueChart = new Chart(revCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue (₹)',
                    data: values,
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'var(--text-secondary)' } },
                    x: { grid: { display: false }, ticks: { color: 'var(--text-secondary)' } }
                }
            }
        });
    }

    // 2. Bike Category Distribution (Doughnut Chart)
    const catCtx = document.getElementById("category-chart");
    if (catCtx) {
        if (categoryChart) categoryChart.destroy();
        const labels = metrics.categoryDistribution.map(d => d.category);
        const values = metrics.categoryDistribution.map(d => d.count);

        categoryChart = new Chart(catCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: ['#06b6d4', '#f59e0b', '#8b5cf6', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: 'var(--text-secondary)', font: { size: 11 } }
                    }
                }
            }
        });
    }

    // 3. Weekly Ride volume (Bar Chart)
    const rentCtx = document.getElementById("rentals-chart");
    if (rentCtx) {
        if (rentalsChart) rentalsChart.destroy();
        const labels = metrics.dailyRentals.map(d => d.label);
        const values = metrics.dailyRentals.map(d => d.value);

        rentalsChart = new Chart(rentCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Rentals Count',
                    data: values,
                    backgroundColor: '#8b5cf6',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'var(--text-secondary)' } },
                    x: { grid: { display: false }, ticks: { color: 'var(--text-secondary)' } }
                }
            }
        });
    }
}

// Load Bike CRUD table
async function loadBikesTable() {
    const tbody = document.getElementById("admin-bikes-tbody");
    if (!tbody) return;

    try {
        const bikes = await apiRequest("/bikes");
        tbody.innerHTML = "";

        bikes.forEach(bike => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${bike.id}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);"><strong>${bike.name}</strong></td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${bike.type}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">₹${bike.pricePerMinute.toFixed(2)}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${bike.batteryPercentage}%</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">
                    <span style="padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight:600; 
                        background-color: ${bike.status === 'AVAILABLE' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};
                        color: ${bike.status === 'AVAILABLE' ? 'var(--success-color)' : 'var(--danger-color)'};">
                        ${bike.status}
                    </span>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color); display: flex; gap: 6px;">
                    <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px; width:auto;" onclick="openEditBikeModal(${JSON.stringify(bike).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn btn-danger" style="padding: 6px 12px; font-size: 12px; width:auto;" onclick="deleteBikeAdmin(${bike.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error("Failed to load admin bikes", e);
    }
}

// Load Users table
async function loadUsersTable() {
    const tbody = document.getElementById("admin-users-tbody");
    if (!tbody) return;

    try {
        const users = await apiRequest("/users");
        tbody.innerHTML = "";

        users.forEach(user => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${user.id}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);"><strong>${user.username}</strong></td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${user.email}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${user.role}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${user.loyaltyPoints} pts</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color); font-weight: 600; color: var(--accent-color);">${user.userLevel}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error("Failed to load admin users", e);
    }
}

// Open modal for Adding Bike
function openAddBikeModal() {
    document.getElementById("modal-title").textContent = "Add New Bike";
    document.getElementById("bike-id-input").value = "";
    document.getElementById("admin-bike-form").reset();
    document.getElementById("bike-modal").style.display = "flex";
}

// Open modal for Editing Bike
function openEditBikeModal(bike) {
    document.getElementById("modal-title").textContent = "Edit Bike Details";
    document.getElementById("bike-id-input").value = bike.id;
    document.getElementById("bike-name-input").value = bike.name;
    document.getElementById("bike-type-select").value = bike.type;
    document.getElementById("bike-price-input").value = bike.pricePerMinute;
    document.getElementById("bike-battery-input").value = bike.batteryPercentage;
    document.getElementById("bike-status-select").value = bike.status;
    document.getElementById("bike-lat-input").value = bike.latitude;
    document.getElementById("bike-lng-input").value = bike.longitude;
    document.getElementById("bike-desc-input").value = bike.description || "";
    document.getElementById("bike-img-input").value = bike.imageUrl;
    
    document.getElementById("bike-modal").style.display = "flex";
}

function closeBikeModal() {
    document.getElementById("bike-modal").style.display = "none";
}

// Save or Update Bike
async function handleBikeFormSubmit(e) {
    e.preventDefault();

    const bikeId = document.getElementById("bike-id-input").value;
    const bikeData = {
        name: document.getElementById("bike-name-input").value,
        type: document.getElementById("bike-type-select").value,
        pricePerMinute: parseFloat(document.getElementById("bike-price-input").value),
        batteryPercentage: parseInt(document.getElementById("bike-battery-input").value),
        status: document.getElementById("bike-status-select").value,
        latitude: parseFloat(document.getElementById("bike-lat-input").value),
        longitude: parseFloat(document.getElementById("bike-lng-input").value),
        description: document.getElementById("bike-desc-input").value,
        imageUrl: document.getElementById("bike-img-input").value
    };

    try {
        let response;
        if (bikeId) {
            // Update
            response = await apiRequest(`/bike/${bikeId}`, "PUT", bikeData);
            showToast("Bike updated successfully!", "success");
        } else {
            // Add
            response = await apiRequest("/bike", "POST", bikeData);
            showToast("New bike added successfully!", "success");
        }

        closeBikeModal();
        loadAdminDashboard();
        loadBikesTable();
    } catch (err) {
        showToast(err.message || "Failed to save bike details", "error");
    }
}

// Delete Bike
async function deleteBikeAdmin(bikeId) {
    if (!confirm("Are you sure you want to delete this bike?")) return;

    try {
        await apiRequest(`/bike/${bikeId}`, "DELETE");
        showToast("Bike deleted successfully!", "success");
        loadAdminDashboard();
        loadBikesTable();
    } catch (err) {
        showToast(err.message || "Failed to delete bike.", "error");
    }
}
