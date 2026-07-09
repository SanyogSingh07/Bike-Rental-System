// Auth Operations
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showRegisterBtn = document.getElementById("show-register");
    const showLoginBtn = document.getElementById("show-login");

    const loginSection = document.getElementById("login-section");
    const registerSection = document.getElementById("register-section");

    // Toggle panels
    if (showRegisterBtn && showLoginBtn && loginSection && registerSection) {
        showRegisterBtn.addEventListener("click", () => {
            loginSection.style.display = "none";
            registerSection.style.display = "block";
        });

        showLoginBtn.addEventListener("click", () => {
            registerSection.style.display = "none";
            loginSection.style.display = "block";
        });
    }

    // Submit Login
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;

            try {
                const data = await apiRequest("/login", "POST", { username, password });
                if (data && data.token) {
                    setToken(data.token);
                    setUsername(data.username);
                    setRole(data.role);
                    showToast("Login successful!", "success");
                    
                    // Redirect based on role
                    setTimeout(() => {
                        if (data.role === "ROLE_ADMIN") {
                            window.location.href = "admin.html";
                        } else {
                            window.location.href = "index.html";
                        }
                    }, 1000);
                }
            } catch (err) {
                showToast(err.message || "Login failed!", "error");
            }
        });
    }

    // Submit Register
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("register-username").value;
            const email = document.getElementById("register-email").value;
            const password = document.getElementById("register-password").value;

            try {
                const data = await apiRequest("/register", "POST", { username, email, password });
                if (data && data.token) {
                    setToken(data.token);
                    setUsername(data.username);
                    setRole(data.role);
                    showToast("Registration successful!", "success");
                    
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1000);
                }
            } catch (err) {
                showToast(err.message || "Registration failed!", "error");
            }
        });
    }

    // Load Profile Info (if profile elements exist)
    const profileName = document.getElementById("profile-username");
    if (profileName) {
        loadUserProfile();
    }
});

async function loadUserProfile() {
    try {
        const profile = await apiRequest("/profile", "GET");
        if (profile) {
            document.getElementById("profile-username").textContent = profile.username;
            document.getElementById("profile-email").textContent = profile.email;
            
            const pointsEl = document.getElementById("profile-points");
            if (pointsEl) pointsEl.textContent = profile.loyaltyPoints;

            const levelEl = document.getElementById("profile-level");
            if (levelEl) levelEl.textContent = profile.userLevel;

            const co2El = document.getElementById("profile-co2");
            if (co2El) co2El.textContent = profile.co2Saved.toFixed(2) + " kg";
        }
    } catch (err) {
        console.error("Failed to load user profile", err);
    }
}
