# Product Roadmap

This document outlines the strategic plan for **Volt Rental**. It highlights the engineering focus areas, feature timelines, and architectural milestones.

---

## 1. Near Term (Q3 2026)
- **Metadata and Repository Setup:** Clean up tracked temporary files, establish clear `.gitignore` boundaries, and define documentation structures.
- **API Improvements:** Enforce standardized JSON payload contracts and add validation filters.
- **Monorepo Build CI:** Establish high-speed independent quality gates for both backend (Maven) and frontend (Vite/React).

---

## 2. Medium Term (Q4 2026)
- **Admin Dashboard Console:** Build a central hub inside the React app to let admins monitor active rides, bike status, and station load.
- **Security Audit:** Establish token blacklisting/revocation mechanics and implement rate-limiting middleware to protect public endpoints.
- **Advanced Pricing Engine:** Calculate dynamic pricing multipliers based on station usage trends and battery metrics.

---

## 3. Long Term (2027)
- **AI Recommendation Engine:** Proactively recommend bikes to riders based on historical commute patterns.
- **IoT Smart Lock Integration:** Communicate directly with physical bike telemetry modules for automatic locking, GPS locating, and theft detection.
- **Mobile Companion Application:** Provide React Native mobile experiences to support QR code unlocking and on-the-go navigation.
