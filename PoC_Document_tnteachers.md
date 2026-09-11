# Proof of Concept (PoC) & Technical Architecture Document
## Project: TET Platform — Tamil Nadu Teachers Welfare Association Study Portal
**Domain Name**: `tnteachers.in`  
**Target Hosting**: BigRock VPS (Virtual Private Server) Hosting  
**Document Version**: 1.0.0 (Production-Ready PoC)  
**Date**: September 2026  

---

## Executive Summary

The **TET Platform** is a state-of-the-art educational and examination preparation web portal designed specifically for candidates preparing for the **Tamil Nadu Eligibility Test (TET)** and students following the **Tamil Nadu State School Curriculum (Grades 1 through 12)**. 

Commissioned under the auspices of **`tnteachers.in`**, the platform delivers an intuitive, fast, and structured learning ecosystem that combines sequential curriculum progression, automated AI-generated practice question banks, full bilingual Tamil/English support, and robust administrative content controls.

---

## 1. Key Objectives & Business Value

1. **Structured Sequential Curriculum**: Enforces step-by-step academic progression (Term 1 $\rightarrow$ Term 2 $\rightarrow$ Term 3; Lesson 1 $\rightarrow$ Lesson 2) to maximize retention and prevent skipping foundational material.
2. **AI-Driven Assessment Engine**: Integrates **Google Gemini AI** to generate 200 interactive practice questions (Stage 3) and 100 timed test exam questions (Stage 4) with detailed explanations.
3. **100% Full-Page Dual Language Support**: Seamless top-right circular toggle (`🌐 த` / `🌐 EN`) for instant translation between **Tamil (தமிழ்)** and **English** across all pages, titles, instructions, and test questions.
4. **Gamified Student Engagement**: Daily task completion status bar, active day streak counter (`🔥 Day Streak`), motivational quotes, and milestone achievement badges (Quick Starter, Bronze Scholar, Silver Academic, and **50-Streak Diamond Legend**).
5. **Granular Admin Content Management**: Dedicated administrative tabs for uploading Class 1-12 PDFs, video lesson URLs, stream subjects (Physics, Chemistry, Botany, Zoology, Computer Science, etc.), custom subject creation, and broadcasting urgent announcements.
6. **High Performance & Enterprise Hosting**: Hosted on **BigRock VPS Hosting** under the primary domain `tnteachers.in` using Nginx reverse proxy and Gunicorn/Uvicorn serverless architecture.

---

## 2. Technical Stack & System Architecture

| Tier | Component | Technology Selected | Rationale & Performance Benefits |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | Web Framework | **React 18 + Vite** | Instant build compilation, modular component structure, high performance. |
| **Styling & Theme** | CSS Utility | **Tailwind CSS** | Custom Ice Blue (`#F8FAFC`), Deep Royal Navy (`#1E3A8A`), and Cognitive Blue (`#0284C7`) theme palette. |
| **Typography** | Font Family | **Plus Jakarta Sans** | Modern, highly legible educational typography. |
| **Backend API** | App Server | **FastAPI (Python 3.12)** | Asynchronous execution, high throughput, automated OpenAPI docs. |
| **Database** | Storage Engine | **SQLite / PostgreSQL** | Relational data integrity for users, progress tracking, materials, and lessons. |
| **AI Engine** | LLM Provider | **Google Gemini AI API** | Dynamic, curriculum-aligned MCQ and timed test generation with fallback layer. |
| **Hosting Infrastructure** | VPS Provider | **BigRock VPS Hosting** | High-speed SSD storage, dedicated IP, scalable RAM/CPU for `tnteachers.in`. |
| **Web Server / Proxy** | Proxy / SSL | **Nginx + Let's Encrypt SSL** | Reverse proxy, static asset caching, HTTPS security. |

---

## 3. Core Feature Breakdown

### 3.1. Design System & Theme Palette

The platform adheres to an evidence-based cognitive color palette tailored for modern educational environments:

- **Ice Blue (`#F8FAFC`)**: Soft, clean background that minimizes eye strain during extended study sessions.
- **Deep Royal Navy (`#1E3A8A`)**: Authoritative, high-contrast color for main titles, primary card headers, and important alerts.
- **Cognitive Blue (`#0284C7`)**: Vivid action color used for primary interactive buttons, active navigation tabs, and progress indicators.

---

### 3.2. User Dashboard & Engagement System

Upon logging in, students are presented with a personalized learning center:

1. **Student Profile Card**: Displays candidate name, account role badge, email address, and academic year status.
2. **Daily Task Completion Status Bar**: Tracks completion of the 4 daily study stages with real-time percentage indicators.
3. **Daily Study Streak Widget**: Visual indicator (`🔥 Day Streak`) that increments when a candidate completes daily lesson tasks.
4. **Daily Motivation Card**: Dynamic daily motivational quote box designed to maintain student momentum.
5. **Streak Achievement Badges**:
   - ⚡ **Quick Starter** (3-day streak)
   - 🏆 **Bronze Scholar** (7-day streak)
   - 🛡️ **Silver Academic** (25-day streak)
   - 👑 **50-Streak Diamond Legend** (50-day streak milestone badge)
6. **Platform Notices**: Live broadcast notifications posted by administrators.

---

### 3.3. Materials Explorer (4-Grid Selection System)

A 4-grid filtering interface allowing students to quickly pinpoint curriculum reference guides:

- **Grid 1 (Grade Selection)**: Interactive buttons for Class 1 through Class 12.
- **Grid 2 (Subject & Medium Selection)**:
  - Language options: **Tamil Medium (தமிழ் வழி)** vs **English Medium (ஆங்கில வழி)**.
  - Grades 1-10: Tamil, English, Mathematics, Science, Social Science.
  - Grades 11-12: Stream subjects (Physics, Chemistry, Botany, Zoology, Computer Science, Commerce, Economics, Accountancy) and custom subjects.
- **Grid 3 (Academic Terms)**: Select Term-1, Term-2, or Term-3.
- **Grid 4 (Preview & Download Center)**:
  - **Inline PDF Viewer Modal**: Reads PDFs directly inside an embedded modal window.
  - **Direct Download**: Instant file download option.

---

### 3.4. Sequential Learning Portal (4 Locked Stages)

To guarantee academic discipline, lessons unlock sequentially:

```
[Term 1 Unlocked] ---> Complete Lessons 1, 2, 3 ---> [Term 2 Unlocked] ---> Complete Lessons ---> [Term 3 Unlocked]
```

Within each lesson, students must complete **4 sequential stages**:

1. **Stage 1 (PDF Study Notes)**: Read official curriculum reference notes $\rightarrow$ Click *"Mark PDF Read"*.
2. **Stage 2 (Video Lecture)**: Watch embedded video lesson in full-screen iframe player $\rightarrow$ Click *"Mark Video Watched"*.
3. **Stage 3 (200 AI MCQs Practice)**: Practice 200 AI-generated multiple-choice questions with instant feedback and explanations.
4. **Stage 4 (100 AI Timed Test)**: Complete a 60-minute timed exam with 100 questions. Scoring $\ge 60\%$ marks the lesson complete and increments the daily streak.

---

### 3.5. Executive Admin Management Portal

An administrative dashboard for platform managers:

- **Separate Upload Tab 1 (Materials Explorer PDFs)**: Upload reference PDFs tagged by Class, Subject, Medium, and Term.
- **Separate Upload Tab 2 (Learning Portal Modules)**: Create 4-stage lesson modules with video embed URLs, lesson order, and study notes.
- **Custom Subject Addition**: Add specialized subjects dynamically.
- **Question & Test Configurator**: Configure Gemini AI API keys, Stage 3 practice count (200), Stage 4 test count (100), time limit (60 mins), and passing score percentage ($60\%$). Direct link provided to [Google AI Studio](https://aistudio.google.com/app/apikey).
- **Student Records & Announcements**: View student streak logs and broadcast urgent announcements.
- **Top-Right Dynamic Toast Notifications**: Modern glassmorphic pop-up alerts for instant feedback on all administrative actions.

---

## 4. Hosting & Infrastructure Architecture (BigRock VPS)

For the live production deployment under domain **`tnteachers.in`**, **BigRock VPS Hosting** provides an isolated, high-performance Linux environment.

```
Client Browser ---> DNS (tnteachers.in) ---> Nginx Reverse Proxy (Port 443 SSL)
                                                 |---> React Static App (dist)
                                                 |---> FastAPI Backend (Port 8000) ---> Database & Gemini AI API
```

### 4.1. BigRock VPS Server Specifications (Recommended)

- **OS**: Ubuntu 22.04 LTS 64-bit
- **vCPU**: 4 Cores
- **RAM**: 8 GB DDR4
- **Storage**: 100 GB NVMe SSD
- **Bandwidth**: Unmetered
- **Domain**: `tnteachers.in` (SSL enabled via Certbot / Let's Encrypt)

---

## 5. Production Deployment Guide for BigRock VPS (`tnteachers.in`)

### Step 1: Server Initialization & Prerequisites

Connect to your BigRock VPS server via SSH:

```bash
ssh root@tnteachers.in
```

Update system packages and install Node.js 20, Python 3.12, Nginx, and Git:

```bash
apt update && apt upgrade -y
apt install -y curl git python3-pip python3-venv nginx certbot python3-certbot-nginx

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

---

### Step 2: Clone Codebase & Setup Backend Service

```bash
# Navigate to web root
mkdir -p /var/www/tnteachers.in
cd /var/www/tnteachers.in

# Clone repository
git clone https://github.com/tho-mas12/TET.git .

# Setup Python Virtual Environment for Backend
cd /var/www/tnteachers.in/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create Systemd Service file for FastAPI (`/etc/systemd/system/tet-backend.service`):

```ini
[Unit]
Description=TET Platform FastAPI Backend Service
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/tnteachers.in/backend
ExecStart=/var/www/tnteachers.in/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start backend service:

```bash
systemctl daemon-reload
systemctl enable tet-backend
systemctl start tet-backend
```

---

### Step 3: Build & Deploy Frontend App

```bash
cd /var/www/tnteachers.in/frontend
npm install
npm run build
```

This compiles optimized static assets into `/var/www/tnteachers.in/frontend/dist`.

---

### Step 4: Configure Nginx Reverse Proxy & Domain SSL (`tnteachers.in`)

Create Nginx Server Block (`/etc/nginx/sites-available/tnteachers.in`):

```nginx
server {
    server_name tnteachers.in www.tnteachers.in;

    # Root directory for React frontend static build
    root /var/www/tnteachers.in/frontend/dist;
    index index.html;

    # Single Page Application routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to FastAPI backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve static uploaded files (PDFs)
    location /static_uploads/ {
        alias /var/www/tnteachers.in/backend/uploads/;
    }
}
```

Enable configuration and reload Nginx:

```bash
ln -s /etc/nginx/sites-available/tnteachers.in /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

### Step 5: Install Free SSL Certificate (Let's Encrypt)

Secure domain `tnteachers.in` with HTTPS:

```bash
certbot --nginx -d tnteachers.in -d www.tnteachers.in
```

---

## 6. Conclusion & Executive Sign-Off

The **TET Platform** is production-ready, highly optimized, and tailored for **`tnteachers.in`**. With BigRock VPS hosting and automated SSL, the client receives a secure, scalable, and modern educational web portal.
