# CleanChennai — Hyper-Local Smart Waste Governance Platform

A full-stack, hyper-local municipal waste governance platform exclusively bounded to the **Greater Chennai Corporation (GCC)** (`[80.1200, 12.8500, 80.3500, 13.2500]`).

Built with **MERN** (MongoDB Atlas, Express.js, React 18, Node.js) and a **Python FastAPI** AI/Vision microservice.

---

## 🎨 Visual Design & Aesthetics

- **Terrava-Inspired Organic Glassmorphism**: Clean rounded cards (`rounded-3xl`), semi-transparent backdrop blur (`backdrop-blur-xl bg-white/70 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]`), and floating pill navigation header.
- **Strict Color Tokens**:
  - `primary-dark`: `#243C2C` (Deep Forest Green)
  - `primary-moss`: `#7A9445` (Moss Green)
  - `accent-lime`: `#DFF478` (Soothing Lime)
  - `surface-glaucous`: `#59789F` (Glaucous Blue)
  - `surface-powder`: `#A9B6C4` (Powder Blue)
  - `surface-vanilla`: `#ECE69D` (Vanilla)
  - `surface-silky`: `#F7F3E6` (Silky White)
  - `base-navy`: `#17243F` (Nautical Navy)
  - `color-floral`: `#92BAD5` (Floral Blue)
  - `color-kawaii`: `#788CE3` (Kawaii Blue)
- **Typography**: Modular retro-modern display typography (`Syne` / `Big Shoulders Display` uppercase stencil-capsule styling) paired with clean geometric `Plus Jakarta Sans` for body text.
- **Universal Age Accessibility (Ages 10–90)**: Dedicated toggle providing large-print typography, high contrast, and spacious touch points (≥ 48px).

---

## 🚀 Key Modules & Capabilities

1. **Citizen Geo-Reporting Interface (Mobile-First)**:
   - Live HTML5 Geolocation binding with automated Greater Chennai Corporation boundary check.
   - Interactive miniature Leaflet pin preview allowing fine-tuning.
   - Quick-load realistic Chennai incident scenarios (Koyambedu Wholesale Market, Cooum River Plastic Choking, T. Nagar Ranganathan St).
   - Real-time 4-stage pipeline animation: *YOLOv8 Detection* → *64-bit DCT pHash* → *MongoDB 20m Proximity Search* → *LULC Risk Weight Evaluation*.
   - Activity Feed with 4-step status progression (`Reported` → `Validated` → `Assigned` → `Resolved`).
   - Duplicate incident detection consolidating citizen reports into upvotes.

2. **Authority Supervisory Suite (Desktop GIS View)**:
   - Live Leaflet.js / OpenStreetMap Chennai map (`[13.0827, 80.2707]`, Zoom 12) restricted to GCC bounds.
   - Muted organic map styling matching Terrava aesthetic.
   - Dynamic KDE Density Heatmap toggle (`leaflet.heat` / density cluster circles).
   - Google Earth Engine (GEE) / LULC Visual Vector Layer:
     - **Commercial / Markets** (T. Nagar, Koyambedu, George Town) → High Risk (Amber, weight 0.8)
     - **Waterway Buffers** (Adyar River, Cooum River, Buckingham Canal) → Critical Ecological Hazard (Cyan/Blue, weight 1.0)
     - **Residential Wards** (Anna Nagar, Mylapore) → Standard Weight (Emerald, weight 0.5)
     - **Vegetation / Parks** (Guindy National Park) → Protected Eco-Zone (weight 0.3)
   - Interactive Triage Drawer: click any pin to inspect photo, computed 64-bit pHash, YOLO detection confidence, upvote tally, and dispatch designated GCC zonal collection trucks.

3. **Field Worker Task Portal**:
   - Mobile-friendly checklist sorted by live spatial proximity to the driver.
   - One-tap "GPS Route" launching turn-by-turn navigation via Google Maps / OSM.
   - Proof of Resolution: driver uploads "Cleared Bin Photo", logs sanitation worker ID and timestamp, marking ticket `Resolved` with confetti feedback.

4. **Integrated Municipal & Civic Alerts Center**:
   - Live alert notices: Critical Waterway Overflow, Market Overload, Monsoon Canal Blockage.
   - Web Audio API harmonic alert chime synthesizer (works 100% offline).
   - GCC administrative broadcast modal.

5. **Open Government Data (OGD) Pipeline**:
   - RFC 7946 GeoJSON export endpoint (`/api/v1/ogd/chennai-waste.geojson`).
   - Live GeoJSON feature collection inspector with one-tap copy and download.

6. **PowerPoint (PPT) Presentation Slide Gallery**:
   - 6 high-definition, neat, 16:9 presentation slide graphics generated for your presentation deck:
     1. `system_architecture.jpg` — System Architecture & Dataflow
     2. `use_case_diagram.jpg` — Platform Use Case Diagram
     3. `er_diagram.jpg` — Entity-Relationship (ER) Database Diagram
     4. `module_description.jpg` — Core Platform Modules
     5. `technology_stack.jpg` — Technology Stack Matrix
     6. `ui_design.jpg` — UI & Experience Design System

---

## 💻 Quick Start & Running Locally

### Option A: One-Click Windows Startup
Double-click `start_all.bat` in the project root to start the AI microservice, Node.js backend, and React client simultaneously.

### Option B: Manual Terminal Execution

#### 1. Start Python AI Microservice (Port 8000)
```bash
cd ai-microservice
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Start Express Backend Server (Port 5000)
```bash
cd server
npm install
npm start
```

#### 3. Start React 18 Client Application (Port 3000)
```bash
cd client
npm install
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000).
