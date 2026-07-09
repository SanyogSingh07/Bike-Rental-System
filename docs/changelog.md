# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.0.0] - 2026-07-09

### Added
- **Repository Recovery Setup:** Configured metadata, added descriptive topics, and enabled GitHub community features (issues, discussions, wiki).
- **Actuator & PostgreSQL Dependencies:** Configured Spring Actuator and PostgreSQL driver in the Maven dependencies block to support production monitoring and connection overrides.
- **MkDocs Integration:** Created an interactive material-themed documentation site (`mkdocs.yml`) with pages for API, Database, Architecture, Deployment, and Security.
- **Monorepo-Aware Actions:** Added comprehensive workflow configurations that build and cache packages independently.

### Changed
- Refactored `.gitignore` to prevent tracking compile output files (`*.tsbuildinfo`, `target/`).

---

## [1.0.0] - 2026-07-09

### Added
- Core backend Spring Boot implementation.
- Modern React application layout.
- Initial engineering documentation and project outline.
