# Comprehensive Proof of Concept (PoC) & Technical Architecture Blueprint
## Project: TET Platform — Tamil Nadu Teachers Welfare Association & School Curriculum Portal
**Target Domain**: `tnteachers.in`  
**Target Infrastructure**: BigRock Virtual Private Server (VPS) Hosting  
**Document Version**: 2.0.0 (Comprehensive Technical Blueprint)  
**Date**: September 2026  

---

## Executive Vision & System Overview

The **TET Platform** is an enterprise-grade digital learning portal custom-engineered to empower candidates preparing for the **Tamil Nadu Eligibility Test (TET)** and students across **Grades 1 through 12** following the **Tamil Nadu State Board Curriculum**. 

Commissioned under the domain **`tnteachers.in`**, the platform integrates structured 4-stage sequential learning paths, AI-powered mock examination generation, complete bilingual (Tamil & English) language toggling, and robust administrative content governance.

---

## 1. Core Platform Pillars & Capabilities

1. **Enforced Sequential Academic Progression**: To maximize knowledge retention and conceptual clarity, advanced academic terms and lessons remain locked until prerequisite modules are satisfied. Students follow a mandatory path: Stage 1 (PDF Notes) $\rightarrow$ Stage 2 (Video Lectures) $\rightarrow$ Stage 3 (200 AI Practice MCQs) $\rightarrow$ Stage 4 (100 AI Timed Test).
2. **AI-Driven Assessment Engine**: Powered by **Google Gemini 1.5 Flash AI**, the engine generates dynamic practice question sets and timed test papers with instant scoring, answer explanations, and automated zero-cost smart fallbacks.
3. **100% Full-Page Dual Language Engine**: A global top-right toggle (`🌐 த` / `🌐 EN`) seamlessly translates all interface elements, titles, navigation controls, instruction sets, and test modules between **Tamil (தமிழ்)** and **English** with zero reload latency.
4. **Gamified Student Engagement & Streaks**: Features daily task completion meters, active day streak counters (`🔥 Day Streak`), dynamic motivational quotes, and milestone achievement badges (Quick Starter, Bronze Scholar, Silver Academic, and **50-Streak Diamond Legend**).
5. **Executive Admin Management Portal**: Dedicated administrative controls featuring dual upload workflows for Materials Explorer PDFs vs 4-stage lesson modules, dynamic stream subject additions (Physics, Chemistry, Botany, Zoology, Computer Science), Gemini AI key management, and glassmorphic toast notifications.

---

## 2. Comprehensive Technical Architecture

### 2.1. System Technology Matrix

| System Layer | Technology Selected | Technical Function & Operational Rationale |
| :--- | :--- | :--- |
| **Frontend Web App** | **React 18 + Vite** | Single Page Application (SPA) providing sub-second page transitions, modular state management, and optimized asset bundling. |
| **Design & Styling** | **Tailwind CSS** | Custom design system utilizing Ice Blue (`#F8FAFC`) background, Deep Royal Navy (`#1E3A8A`) headers, and Cognitive Blue (`#0284C7`) controls. |
| **Typography** | **Plus Jakarta Sans** | Legibility-focused educational font supporting clean rendering for mathematical, Tamil script, and English text. |
| **Backend Server API**| **FastAPI (Python 3.12)**| Asynchronous ASGI framework delivering high concurrency, automated OpenAPI validation, and lightweight payload parsing. |
| **Database Engine** | **SQLite / PostgreSQL** | Relational persistence storing user profiles, academic progress records, material definitions, and lesson metadata. |
| **AI Generator Engine**| **Google Gemini 1.5 Flash API**| Large Language Model generating structured JSON question arrays with automated fallback mechanisms. |
| **Web Server & Proxy**| **Nginx + Let's Encrypt SSL**| Reverse proxy server performing TLS termination, HTTP/2 multiplexing, static file caching, and daemon management. |

---

### 2.2. Data Flow Architecture

```
[ Student / User Browser ]
           |
           v
 [ DNS Resolution: tnteachers.in ]
           |
           v
 [ Nginx Reverse Proxy (Port 443 HTTPS - SSL Certificate) ]
     |                                               |
     |---> React Static SPA (/dist)                  |---> FastAPI Async Backend (Port 8000)
                                                                 |
                                                     +-----------+-----------+
                                                     |                       |
                                             [ SQLite Database ]   [ Google Gemini AI API ]
```

---

## 3. Deep-Dive Module Specifications

### 3.1. Design System & Theme Palette

- **Ice Blue (`#F8FAFC`)**: Soft background shade carefully engineered to minimize visual fatigue during multi-hour study sessions.
- **Deep Royal Navy (`#1E3A8A`)**: High-contrast, authoritative color for primary headers, navigation menus, and critical alerts.
- **Cognitive Blue (`#0284C7`)**: Vivid blue used for active buttons, tab selection indicators, and streak highlights.

---

### 3.2. Authentication & Role-Based Access Control (RBAC)

1. **Initial Visit Gateway**: Visitors are greeted with a dedicated login modal.
2. **Student Authentication Workflow**: Authenticates credentials and routes directly to the student dashboard.
3. **Admin Authentication Workflow**: Authenticates administrative privileges and redirects directly to the Executive Admin Portal (`activeTab = "admin"`).

---

### 3.3. Student Dashboard & Gamification Engine

- **Profile Summary Card**: Candidate name, academic status, roll number, and role badge.
- **Daily Progress Bar**: Dynamic completion meter calculating overall percentage completed across daily study tasks.
- **Active Day Streak Counter**: Prominent `🔥 Day Streak` widget tracking consecutive study days.
- **Motivational Quote Engine**: Daily inspirational quote rendered in the selected language.
- **Milestone Badges**:
  - ⚡ **Quick Starter**: Unlocked upon completing 3 consecutive days.
  - 🏆 **Bronze Scholar**: Unlocked upon completing 7 consecutive days.
  - 🛡️ **Silver Academic**: Unlocked upon completing 25 consecutive days.
  - 👑 **50-Streak Diamond Legend**: Milestone badge awarded for 50 consecutive days of study.

---

### 3.4. Materials Explorer (4-Grid Selection Pipeline)

1. **Grid 1 (Grade Level)**: Select Class 1 through Class 12.
2. **Grid 2 (Subject & Medium)**:
   - Medium Toggle: **Tamil Medium (தமிழ் வழி)** vs **English Medium (ஆங்கில வழி)**.
   - Grades 1-10: Tamil, English, Mathematics, Science, Social Science.
   - Grades 11-12: Specialized streams (Physics, Chemistry, Botany, Zoology, Computer Science, Commerce, Economics) and custom subjects.
3. **Grid 3 (Academic Terms)**: Filter by Term 1, Term 2, or Term 3.
4. **Grid 4 (Preview & Download Center)**:
   - **Inline PDF Viewer Modal**: High-res inline PDF viewer rendering study notes directly inside an embedded modal window.
   - **Direct Download Trigger**: One-click direct PDF file download option.

---

### 3.5. 4-Stage Sequential Learning Engine

Lessons unlock in strict sequence:
$$\text{Term 1 Unlocked} \longrightarrow \text{Complete Lessons} \longrightarrow \text{Term 2 Unlocked} \longrightarrow \text{Complete Lessons} \longrightarrow \text{Term 3 Unlocked}$$

Four mandatory sequential stages per lesson:
- **Stage 1 (PDF Study Notes)**: Student reads reference PDF notes $\rightarrow$ Clicks *"Mark PDF Read"*.
- **Stage 2 (Interactive Video Lecture)**: Video lecture player embedding curated video content $\rightarrow$ Clicks *"Mark Video Watched"*.
- **Stage 3 (200 AI MCQs Practice Bank)**: 200 AI-generated multiple-choice practice questions with instant answer evaluation and explanation pop-ups.
- **Stage 4 (100 AI Timed Test Exam)**: 60-minute timed exam environment presenting 100 questions. Scoring $\ge 60\%$ marks lesson complete, increments streak, and unlocks the next lesson.

---

### 3.6. Executive Admin Management Portal

- **Separate Upload Tab 1**: PDF upload pipeline for Materials Explorer.
- **Separate Upload Tab 2**: 4-stage lesson module creator for Learning Portal.
- **Custom Subject Addition**: Dynamic creation of specialized Higher Secondary stream subjects.
- **Gemini AI Configurator**: Directly configure API key with direct link to [Google AI Studio](https://aistudio.google.com/app/apikey).
- **Glassmorphic Toast Alerts**: Dynamic top-right pop-up alerts providing real-time feedback for all operations.

---

## 4. Google Gemini AI Engine Architecture & Fallback Resiliency

### 4.1. Prompt Construction & JSON Generation
The platform interfaces with **Google Gemini 1.5 Flash** to generate curriculum-specific assessment modules. Prompts explicitly enforce strict JSON schema outputs containing question text, 4 options, correct answer index, and detailed rationale.

### 4.2. Zero-Cost Smart Fallback Engine
To ensure uninterrupted student learning during rate limits or API key absence:
1. **API Limit Detection**: Detects HTTP 429 rate limit or missing API key.
2. **Fallback Activation**: Instantly activates local curriculum-aligned fallback question banks.
3. **Zero Interruption**: Students receive complete 200 practice questions and 100 timed test questions without error screens.

---

## 5. Persistence & Data Synchronization Strategy

- **Client-Side LocalStorage Persistence**: Materials Explorer PDFs and Learning Modules published in the Admin Portal are cached in browser local storage (`saveUploadedMaterialClient` & `saveUploadedLessonClient`), ensuring data persists across page reloads on stateless cloud environments.
- **Server Database Storage**: FastAPI syncs user profiles, test scores, streak counters, and curriculum records to SQLite/PostgreSQL on the VPS server.

---

## 6. Production Deployment Blueprint (BigRock VPS)

### Step 1: Connect & Install Dependencies
```bash
ssh root@tnteachers.in
apt update && apt upgrade -y
apt install -y curl git python3-pip python3-venv nginx certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs
```

### Step 2: Deploy Backend Service
```bash
cd /var/www
git clone https://github.com/tho-mas12/TET.git tnteachers.in
cd /var/www/tnteachers.in/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `/etc/systemd/system/tet-backend.service`:
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

```bash
systemctl daemon-reload && systemctl enable --now tet-backend
```

### Step 3: Deploy Frontend Build
```bash
cd /var/www/tnteachers.in/frontend
npm install
npm run build
```

### Step 4: Configure Nginx & Issue SSL
Create `/etc/nginx/sites-available/tnteachers.in`:
```nginx
server {
    server_name tnteachers.in www.tnteachers.in;
    root /var/www/tnteachers.in/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/tnteachers.in /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d tnteachers.in -d www.tnteachers.in
```

---

## 7. Downloadable Detailed Word Document

The in-depth technical document is available for direct client presentation:

- 📄 **Detailed Technical Word Document**:  
  [Download TET_Platform_Detailed_PoC_tnteachers.docx](file:///C:/Users/Thomas%20Darwin/.gemini/antigravity/brain/256e8d92-c216-43fd-894b-634052057c1a/TET_Platform_Detailed_PoC_tnteachers.docx)
- 🔗 **GitHub Repository**:  
  [https://github.com/tho-mas12/TET.git](https://github.com/tho-mas12/TET.git)

---

## 8. Technical Sign-Off

This document constitutes the comprehensive Proof of Concept (PoC) and Technical Blueprint for **`tnteachers.in`**. All software modules, AI evaluation systems, translation frameworks, and administrative portals are fully validated and production-ready.
