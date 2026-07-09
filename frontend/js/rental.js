// Rental & Station Operations

let timerInterval = null;

// Initialize ride timer
function startRideTimer(startTimeStr, pricePerMinute) {
    const startTime = new Date(startTimeStr).getTime();
    const durationEl = document.getElementById("ride-duration");
    const costEl = document.getElementById("ride-cost");
    const timerRing = document.getElementById("timer-ring");

    if (timerRing) timerRing.classList.add("active");
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const diffMs = now - startTime;

        if (diffMs < 0) return;

        const diffSeconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(diffSeconds / 60);
        const seconds = diffSeconds % 60;

        if (durationEl) {
            durationEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        // Price is based on minutes (minimum 1 min charge)
        const chargedMinutes = Math.max(1, minutes);
        const currentCost = chargedMinutes * pricePerMinute;
        if (costEl) {
            costEl.textContent = `₹${currentCost.toFixed(2)}`;
        }
    }, 1000);
}

// Load Active Ride details
async function loadActiveRide() {
    try {
        const activeRide = await apiRequest("/rental/active");
        
        if (activeRide && activeRide.id) {
            document.getElementById("active-ride-section").style.display = "block";
            document.getElementById("no-ride-section").style.display = "none";
            
            document.getElementById("ride-bike-name").textContent = activeRide.bike.name;
            document.getElementById("ride-bike-type").textContent = activeRide.bike.type;
            document.getElementById("ride-bike-rate").textContent = `₹${activeRide.bike.pricePerMinute.toFixed(2)}/min`;
            
            // Start ticking
            startRideTimer(activeRide.startTime, activeRide.bike.pricePerMinute);
        } else {
            document.getElementById("active-ride-section").style.display = "none";
            document.getElementById("no-ride-section").style.display = "block";
            if (timerInterval) clearInterval(timerInterval);
        }
    } catch (err) {
        showToast(err.message || "Failed to load active ride info", "error");
    }
}

// Rent a Bike (Simulate QR Scan success)
async function rentBike(bikeId) {
    try {
        showToast("Processing unlock...", "info");
        const rental = await apiRequest("/rent", "POST", { bikeId: parseInt(bikeId) });
        if (rental && rental.id) {
            showToast("Bike unlocked! Have a safe ride.", "success");
            setTimeout(() => {
                window.location.href = "ride-status.html";
            }, 1200);
        }
    } catch (err) {
        showToast(err.message || "Failed to rent bike.", "error");
    }
}

// Return Rented Bike
async function returnBike() {
    try {
        showToast("Ending ride & locking bike...", "info");
        
        // Mock a coordinates location return: Center of New York Downtown Station
        const returnLat = 40.7128 + (Math.random() - 0.5) * 0.005;
        const returnLng = -74.0060 + (Math.random() - 0.5) * 0.005;

        const rental = await apiRequest("/return", "POST", { latitude: returnLat, longitude: returnLng });
        if (rental && rental.id) {
            if (timerInterval) clearInterval(timerInterval);
            
            // Populate Receipt Modal
            document.getElementById("receipt-bike").textContent = rental.bike.name;
            document.getElementById("receipt-duration").textContent = Math.round(rental.distanceTravelled / 0.25) + " mins";
            document.getElementById("receipt-cost").textContent = `₹${rental.totalCost.toFixed(2)}`;
            document.getElementById("receipt-distance").textContent = `${rental.distanceTravelled.toFixed(2)} km`;
            document.getElementById("receipt-co2").textContent = `${(rental.distanceTravelled * 0.21).toFixed(2)} kg`;
            
            // Show Modal
            document.getElementById("receipt-modal").style.display = "flex";
        }
    } catch (err) {
        showToast(err.message || "Failed to return bike.", "error");
    }
}

// Load Available Bikes list on Home page
async function loadBikes(filterType = "all", searchQuery = "") {
    const bikeListContainer = document.getElementById("bike-list");
    if (!bikeListContainer) return;

    try {
        // Mock client location for distance calculations (Downtown New York)
        const lat = 40.7128;
        const lng = -74.0060;
        
        const bikes = await apiRequest(`/bikes?lat=${lat}&lng=${lng}`);
        if (!bikes) return;

        bikeListContainer.innerHTML = "";

        // Check if there's an active filters or search query
        let filteredBikes = bikes.filter(bike => {
            const matchesSearch = bike.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  bike.type.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (filterType === "all") return matchesSearch;
            return bike.type.toLowerCase() === filterType.toLowerCase() && matchesSearch;
        });

        if (filteredBikes.length === 0) {
            bikeListContainer.innerHTML = `<div class="text-center" style="grid-column: 1/-1; padding: 40px 0; color: var(--text-secondary);">No bikes match your search filter.</div>`;
            return;
        }

        filteredBikes.forEach(bike => {
            const isFav = localStorage.getItem(`fav_${bike.id}`) === "true";
            
            const card = document.createElement("article");
            card.className = "relative bg-[#2D2D2D] rounded-xl border border-white/10 overflow-hidden flex flex-col group";
            card.innerHTML = `
                <!-- Premium Badge -->
                ${bike.pricePerMinute >= 5.0 ? `
                <div class="absolute top-sm left-sm z-10 bg-primary-container px-2 py-1 rounded-full border border-outline-variant/50 backdrop-blur-md">
                    <span class="font-label-bold text-label-bold text-[#00D26A]">PRO</span>
                </div>
                ` : ''}
                <!-- Battery / Range Badge -->
                <div class="absolute top-sm right-sm z-10 glass-panel px-2 py-1 rounded-full flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px] text-[#00D26A]" style="font-variation-settings: 'FILL' 1;">battery_charging_full</span>
                    <span class="font-label-bold text-label-bold text-on-surface">${bike.batteryPercentage}%</span>
                </div>
                <!-- Image Area -->
                <div class="h-48 w-full bg-surface-container-low relative overflow-hidden flex items-center justify-center p-lg">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#2D2D2D] to-transparent z-0"></div>
                    <img class="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105" src="${bike.imageUrl}" alt="${bike.name}"/>
                </div>
                <!-- Details Area -->
                <div class="p-md flex flex-col flex-1 bg-[#2D2D2D] z-10">
                    <div class="flex justify-between items-start mb-sm">
                        <div>
                            <h3 class="font-title-md text-title-md text-on-surface leading-tight">${bike.name}</h3>
                            <p class="font-body-sm text-body-sm text-on-surface-variant">${bike.distance ? bike.distance.toFixed(2) : 0.0} km away • ${bike.status}</p>
                        </div>
                        <div class="text-right">
                            <div class="font-title-md text-title-md text-on-surface">₹${bike.pricePerMinute.toFixed(2)}<span class="font-body-sm text-body-sm text-on-surface-variant">/min</span></div>
                        </div>
                    </div>
                    <!-- Action -->
                    <div class="flex gap-2 mt-auto">
                        <a href="details.html?id=${bike.id}" class="w-1/2 bg-transparent border border-white/20 text-on-surface font-title-md text-title-md py-sm rounded-lg active:scale-[0.98] transition-transform hover:bg-white/5 text-center flex items-center justify-center">Details</a>
                        ${bike.status === 'AVAILABLE' ? `
                        <button class="w-1/2 bg-[#00D26A] text-[#111111] font-title-md text-title-md py-sm rounded-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2" onclick="selectForRent(${bike.id})">
                                            Rent Now <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </button>
                        ` : `
                        <button class="w-1/2 bg-surface-variant text-on-surface-variant font-title-md text-title-md py-sm rounded-lg cursor-not-allowed" disabled>
                                            Unavailable
                        </button>
                        `}
                    </div>
                    <!-- Compare Checkbox -->
                    <div class="mt-4 flex items-center justify-center">
                        <label class="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer">
                            <input type="checkbox" class="compare-checkbox rounded border-outline-variant bg-transparent text-electric focus:ring-0" data-id="${bike.id}" data-name="${bike.name}" onchange="handleCompareSelect(this)"> Compare
                        </label>
                    </div>
                </div>
            `;
            bikeListContainer.appendChild(card);
        });

        // Recheck checkboxes after rendering
        updateCompareTray();
    } catch (err) {
        showToast("Could not load bikes list", "error");
    }
}

// Bike Details loader
async function loadBikeDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (!id) return;

    try {
        const bike = await apiRequest(`/bike/${id}`);
        if (!bike) return;

        document.getElementById("detail-title").textContent = bike.name;
        document.getElementById("detail-image").src = bike.imageUrl;
        document.getElementById("detail-type").textContent = bike.type;
        document.getElementById("detail-type-badge").className = `bike-badge badge-${bike.type.toLowerCase()}`;
        document.getElementById("detail-type-badge").textContent = bike.type;
        document.getElementById("detail-price").textContent = `₹${bike.pricePerMinute.toFixed(2)}`;
        document.getElementById("detail-battery").textContent = `${bike.batteryPercentage}%`;
        document.getElementById("detail-status").textContent = bike.status;
        document.getElementById("detail-description").textContent = bike.description || "No description provided.";

        const actionContainer = document.getElementById("detail-action-container");
        if (bike.status === 'AVAILABLE') {
            actionContainer.innerHTML = `<button class="btn btn-primary" onclick="selectForRent(${bike.id})"><i class="fas fa-qrcode"></i> Rent This Bike</button>`;
        } else {
            actionContainer.innerHTML = `<button class="btn btn-secondary" disabled style="opacity: 0.5;">Bike is currently ${bike.status.toLowerCase()}</button>`;
        }
    } catch (err) {
        showToast("Error loading bike details", "error");
    }
}

// Redirect to QR scan page with pre-selected bike
function selectForRent(bikeId) {
    window.location.href = `rent.html?bikeId=${bikeId}`;
}

// Toggle Favorites
function toggleFavorite(event, bikeId) {
    event.stopPropagation();
    const btn = event.currentTarget;
    const isFav = btn.classList.contains("active");
    
    if (isFav) {
        btn.classList.remove("active");
        localStorage.removeItem(`fav_${bikeId}`);
        showToast("Removed from favorites", "info");
    } else {
        btn.classList.add("active");
        localStorage.setItem(`fav_${bikeId}`, "true");
        showToast("Added to favorites!", "success");
    }
}

// Recommendation system trigger
async function loadRecommendations() {
    const recBox = document.getElementById("recommendation-box");
    if (!recBox) return;

    try {
        const lat = 40.7128;
        const lng = -74.0060;
        const rec = await apiRequest(`/recommendation?lat=${lat}&lng=${lng}`);
        
        if (rec && rec.recommendedBike) {
            document.getElementById("rec-message").textContent = rec.recommendationMessage;
            document.getElementById("rec-weather").textContent = rec.weather;
            document.getElementById("rec-bike-name").textContent = rec.recommendedBike.name;
            document.getElementById("rec-bike-type").textContent = rec.recommendedBike.type;
            document.getElementById("rec-bike-price").textContent = `₹${rec.recommendedBike.pricePerMinute.toFixed(2)}/min`;
            document.getElementById("rec-bike-battery").textContent = `${rec.recommendedBike.batteryPercentage}%`;
            
            // Set action button
            document.getElementById("rec-action-btn").onclick = () => selectForRent(rec.recommendedBike.id);
        } else {
            recBox.style.display = "none";
        }
    } catch (e) {
        recBox.style.display = "none";
    }
}

// Stations List
async function loadStations() {
    const list = document.getElementById("stations-list");
    if (!list) return;

    try {
        const stations = await apiRequest("/stations");
        if (!stations) return;

        list.innerHTML = "";
        stations.forEach(station => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div class="d-flex justify-between align-center mb-4">
                    <h3 style="font-size: 18px; font-weight: 700;">${station.name}</h3>
                    <span style="font-size: 13px; font-weight: 600; color: var(--success-color);">${station.availableBikes} bikes available</span>
                </div>
                <div class="bike-meta">
                    <span><i class="fas fa-parking"></i> Slots: ${station.availableBikes}/${station.totalSlots}</span>
                    <span><i class="fas fa-map-marker-alt"></i> Lat: ${station.latitude.toFixed(4)}, Lng: ${station.longitude.toFixed(4)}</span>
                </div>
                <button class="btn btn-secondary mt-4" style="padding: 8px 16px; font-size: 13px;" onclick="showToast('Routing to station simulated...', 'success')">Get Directions</button>
            `;
            list.appendChild(card);
        });
    } catch (err) {
        showToast("Error loading stations list", "error");
    }
}

// Compare System
let comparedBikes = [];
function handleCompareSelect(checkbox) {
    const bikeId = parseInt(checkbox.dataset.id);
    const bikeName = checkbox.dataset.name;

    if (checkbox.checked) {
        if (comparedBikes.length >= 2) {
            checkbox.checked = false;
            showToast("You can only compare up to 2 bikes side-by-side.", "warning");
            return;
        }
        comparedBikes.push({ id: bikeId, name: bikeName });
    } else {
        comparedBikes = comparedBikes.filter(b => b.id !== bikeId);
    }
    updateCompareTray();
}

function updateCompareTray() {
    const tray = document.getElementById("compare-tray");
    if (!tray) return;

    if (comparedBikes.length > 0) {
        tray.style.display = "flex";
        document.getElementById("compare-count-text").textContent = `${comparedBikes.length} bike(s) selected`;
        
        const compareGoBtn = document.getElementById("compare-go-btn");
        if (comparedBikes.length === 2) {
            compareGoBtn.disabled = false;
            compareGoBtn.style.opacity = "1";
        } else {
            compareGoBtn.disabled = true;
            compareGoBtn.style.opacity = "0.5";
        }
    } else {
        tray.style.display = "none";
    }
}

async function triggerCompare() {
    if (comparedBikes.length !== 2) return;
    try {
        const bike1 = await apiRequest(`/bike/${comparedBikes[0].id}`);
        const bike2 = await apiRequest(`/bike/${comparedBikes[1].id}`);

        if (bike1 && bike2) {
            document.getElementById("compare-name-1").textContent = bike1.name;
            document.getElementById("compare-img-1").src = bike1.imageUrl;
            document.getElementById("compare-type-1").textContent = bike1.type;
            document.getElementById("compare-price-1").textContent = `₹${bike1.pricePerMinute.toFixed(2)}/min`;
            document.getElementById("compare-battery-1").textContent = `${bike1.batteryPercentage}%`;
            document.getElementById("compare-status-1").textContent = bike1.status;

            document.getElementById("compare-name-2").textContent = bike2.name;
            document.getElementById("compare-img-2").src = bike2.imageUrl;
            document.getElementById("compare-type-2").textContent = bike2.type;
            document.getElementById("compare-price-2").textContent = `₹${bike2.pricePerMinute.toFixed(2)}/min`;
            document.getElementById("compare-battery-2").textContent = `${bike2.batteryPercentage}%`;
            document.getElementById("compare-status-2").textContent = bike2.status;

            document.getElementById("compare-modal").style.display = "flex";
        }
    } catch (e) {
        showToast("Error loading comparison details", "error");
    }
}

function closeCompare() {
    document.getElementById("compare-modal").style.display = "none";
    // Uncheck checkboxes and reset array
    comparedBikes = [];
    document.querySelectorAll(".compare-checkbox").forEach(cb => cb.checked = false);
    updateCompareTray();
}
