# 🚀 Kazi Khalid Hasan Tamim | Principal Staff QA Architect & Senior SDET Portfolio

> High-density, engineering-first personal portfolio website built with **Next.js 14 (App Router)**, **Tailwind CSS**, and **Lucide Icons**, featuring an enterprise-grade **Flagship Engine Showcase**, **Live Telemetry & Artifact Inspector**, **Architecture Philosophy Matrix**, and full **Admin Control Panel (CMS)**.

---

## 📐 Design & Engineering Architecture

### 1. Visual Aesthetic
- **Matte Solid Dark-Neutral Palette**: `bg-zinc-950` / `bg-zinc-900` with strict 1px solid border tokens (`border-zinc-800`), eliminating noisy gradients and frosted blurs.
- **Strict Surface Elevations**: 1-2 step elevations (`bg-zinc-950` base, `bg-zinc-900` card panels, `bg-zinc-850` elevated components).
- **Single Vivid Accent Color**: Emerald green (`#10b981`) for pass rates, telemetry pulses, and primary actions.

### 2. Microcopy & Content Density (High Signal, Zero Fluff)
- Hard architectural telemetry metrics:
  - **Total CI Runs**: `28,450+` continuous automated jobs
  - **Parallel Sharded Speedup**: `5.2x Faster` (sub-4 minute execution across 8 containers)
  - **Flakiness Ratio**: `< 0.28%` via deterministic auto-waiting & network interceptors
  - **Target Critical Path Coverage**: `96.4%` user journeys & microservice contracts

---

## 🏛️ Core Architecture & Sections

### 1. Header & Hero Hub
- **Direct Positioning**: `Kazi Khalid Hasan Tamim | Senior Software Development Engineer in Test (SDET) | Quality Systems Architect`
- **Value Proposition**: *Engineering deterministic test frameworks, self-healing pipelines, and resilient CI/CD test gates.*
- **Action Hub**: View GitHub Repos, Inspect Live Allure Report, Download Resume, and Admin CMS Access.
- **Security Telemetry**: Verified Google Bug Hunters VRP researcher (Year of the Snake & First Report Submitted awards).

### 2. Flagship Project Showcase (The Core Engine)
Interactive bento cards for 4 production-grade engineering engines:
1. **Enterprise Hybrid Playwright / TypeScript Framework**: Sharded parallel workers, custom fixtures, direct API state injection (`storageState.json`), and containerization.
2. **Microservices Contract & Schema Verification Suite**: Pact consumer-driven contracts, OpenAPI schema draft-07 assertions, dynamic OAuth2 lifecycle, and chaos fault injection.
3. **Distributed Performance & Reliability Suite**: k6 modular load models, percentile latency assertions (`p95 < 150ms`, `p99 < 210ms`), and Prometheus/Grafana regression gates.
4. **Agentic QA & LLM Evaluation Harness**: Promptfoo / DeepEval pipeline testing model drift, hallucination boundaries, adversarial prompt injections, and deterministic JSON schemas.
*Each card features an ASCII execution pipeline schematic, key engineering challenges overcome, CI/CD quality gate specs, and repository links.*

### 3. Testing Philosophy & Architecture Matrix
Direct side-by-side contrast between **Common QA Practices (Anti-patterns)** vs. **My Engineering Standards**:
- Pre-authenticated API session state injection vs. UI login form steps
- Deterministic DOM auto-waiting vs. hardcoded `sleep()` calls
- Containerized sharded CI parallel runners vs. single-node local runs
- Comprehensive Playwright Trace Viewer packages vs. static PNG screenshots
- Automated zero-defect merge-blocking PR gates vs. delayed manual regression bottlenecks

### 4. Live Telemetry & Artifact Inspector
Embedded report viewer simulating an actual **Playwright / Allure HTML Report**:
- Filterable spec execution list with microsecond timings
- Step-by-step action breakdown
- Network payload & status assertions (200/201 OK)
- Trace Viewer package attachments (`trace.zip`)

### 5. Technical Competence Matrix
- **Automation Toolchains**: Playwright (TS/JS), Cypress, Selenium WebDriver 4, Appium Mobile, Robot Framework, Cucumber BDD
- **Backend & Performance**: k6 Load Testing, REST Assured, Postman/Newman CLI, Pact, Supertest, Apache JMeter
- **DevOps & Environments**: GitHub Actions, Docker & Compose, Testcontainers, Jenkins Pipelines, AWS Cloud, LocalStack
- **Observability & Languages**: TypeScript, Python, Java 17, SQL, Prometheus & Grafana, Allure Reporting

### 6. Built-in Admin Panel CMS (`/admin`)
- Accessible at [http://localhost:3000/admin](http://localhost:3000/admin) with PIN `admin123`.
- Allows modifying every detail, adding projects/skills/experiences, reading contact inquiries, and 1-click JSON database backup/export.

---

## 🏃 Running the Application

```bash
# Install dependencies (Tailwind CSS, Lucide icons, Next.js)
npm install

# Run development server
npm run dev

# Production build
npm run build
npm run start
```
Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001).
