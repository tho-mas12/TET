# Proof of Concept (PoC), Commercial Pricing & Technical Architecture Document
## Project: TET Platform — Tamil Nadu Teachers Welfare Association Study Portal
**Domain Name**: `tnteachers.in`  
**Target Hosting**: BigRock VPS (Virtual Private Server) Hosting  
**Document Version**: 1.1.0 (Production & Commercial Proposal)  
**Date**: September 2026  

---

## Executive Summary

The **TET Platform** is a state-of-the-art educational and examination preparation web portal designed specifically for candidates preparing for the **Tamil Nadu Eligibility Test (TET)** and students following the **Tamil Nadu State School Curriculum (Grades 1 through 12)**. 

Commissioned under the domain **`tnteachers.in`**, the platform delivers a fast, structured learning ecosystem combining sequential curriculum progression, automated AI-generated practice question banks, 100% bilingual Tamil/English translation, and robust administrative content controls.

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
| **Frontend UI** | Web Framework | **React 18 + Vite** | Modular, ultra-fast client-side rendering with instant loading times. |
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

- **Ice Blue (`#F8FAFC`)**: Soft, clean background that minimizes eye strain during extended study sessions.
- **Deep Royal Navy (`#1E3A8A`)**: Authoritative, high-contrast color for main titles, primary card headers, and important alerts.
- **Cognitive Blue (`#0284C7`)**: Vivid action color used for primary interactive buttons, active navigation tabs, and progress indicators.

---

### 3.2. User Dashboard & Engagement System

1. **Student Profile Card**: Candidate name, account role badge, email address, academic status.
2. **Daily Task Completion Status Bar**: Real-time progress percentage bar across the 4 daily study stages.
3. **Daily Study Streak Widget**: Visual indicator (`🔥 Day Streak`) incrementing upon completing daily tasks.
4. **Daily Motivation Card**: Dynamic motivational quote card.
5. **Streak Achievement Badges**:
   - ⚡ **Quick Starter** (3-day streak)
   - 🏆 **Bronze Scholar** (7-day streak)
   - 🛡️ **Silver Academic** (25-day streak)
   - 👑 **50-Streak Diamond Legend** (50-day streak milestone badge)
6. **Platform Notices**: Live broadcast notifications posted by administrators.

---

### 3.3. Materials Explorer (4-Grid Selection System)

- **Grid 1 (Grade Selection)**: Class 1 through Class 12.
- **Grid 2 (Subject & Medium Selection)**:
  - Language options: **Tamil Medium (தமிழ் வழி)** vs **English Medium (ஆங்கில வழி)**.
  - Grades 1-10: Tamil, English, Mathematics, Science, Social Science.
  - Grades 11-12: Stream subjects (Physics, Chemistry, Botany, Zoology, Computer Science, Commerce, Economics, Accountancy) and custom subjects.
- **Grid 3 (Academic Terms)**: Select Term-1, Term-2, or Term-3.
- **Grid 4 (Preview & Download Center)**:
  - **Inline PDF Viewer Modal**: High-res PDF viewer directly inside an embedded modal window.
  - **Direct Download**: Instant file download option.

---

### 3.4. Sequential Learning Portal (4 Locked Stages)

Lessons unlock in strict sequence:
```
[Term 1 Unlocked] ---> Complete Lessons ---> [Term 2 Unlocked] ---> Complete Lessons ---> [Term 3 Unlocked]
```

Four sequential stages per lesson:
1. **Stage 1 (PDF Study Notes)**: Read official reference notes $\rightarrow$ Click *"Mark PDF Read"*.
2. **Stage 2 (Video Lecture)**: Interactive full-screen video iframe player $\rightarrow$ Click *"Mark Video Watched"*.
3. **Stage 3 (200 AI MCQs Practice)**: Practice 200 AI-generated multiple-choice questions with explanations.
4. **Stage 4 (100 AI Timed Test)**: 60-minute timed exam with 100 questions. Scoring $\ge 60\%$ marks lesson complete and increments daily streak.

---

### 3.5. Executive Admin Management Portal

- **Separate Upload Tab 1**: Dedicated PDF upload for Materials Explorer.
- **Separate Upload Tab 2**: Dedicated 4-stage lesson module creation for Learning Portal.
- **Custom Subject Addition**: Dynamic subject addition for specialized streams.
- **Question & AI Configurator**: Configure Gemini AI API keys with direct link to [Google AI Studio](https://aistudio.google.com/app/apikey).
- **Toast Alerts**: Top-right glassmorphic pop-up notifications for all administrative operations.

---

## 4. Google Gemini AI Pricing & Cost Analysis

### Is the Google Gemini API Free?

**YES! Google Gemini API provides a generous FREE Tier for developers and educational platforms.**

#### Free Tier Allowance (Google Gemini 1.5 Flash):
- **Cost**: **₹0.00 / Month (100% FREE)**
- **Rate Limit**: **15 Requests Per Minute (RPM)**
- **Daily Limit**: **1,500 Requests Per Day (RPD)**
- **Token Allowance**: **1,000,000 Tokens Per Minute (TPM)**

> [!NOTE]  
> **What does 1,500 requests per day mean for the platform?**  
> 1,500 daily requests allow hundreds of students to generate custom practice sets every single day completely free of charge.

#### Automated Zero-Cost Fallback System
If the Gemini API key is omitted or daily free rate limits are reached during peak exam hours, the TET Platform automatically activates its **Built-in Smart Fallback Engine**. This ensures students always receive 200 practice questions and 100 timed test exams at **₹0 cost**.

#### Paid Scaling Costs (If Scaled to Tens of Thousands of Students)
If the portal expands to over 50,000 active daily students, switching to Google's Pay-As-You-Go plan is exceptionally affordable:
- **Input Tokens**: ~ ₹6.25 per 1,000,000 tokens ($0.075 / 1M tokens)
- **Output Tokens**: ~ ₹25.00 per 1,000,000 tokens ($0.30 / 1M tokens)
- **Estimated Monthly Cost for 10,000 Daily Active Users**: **~ ₹250 to ₹500 / Month**.

---

## 5. Commercial Pricing Plan & Budget Breakdown (`tnteachers.in`)

Below is the itemized commercial cost proposal for the development, infrastructure, hosting, and deployment of the TET Platform for the client.

### 5.1. One-Time Setup & Development Costs

| Item / Description | Features Included | Cost (INR ₹) |
| :--- | :--- | :--- |
| **Portal Development & Core Architecture** | Complete React 18 frontend, FastAPI backend, 4-stage learning portal, 4-grid materials explorer, 100% Tamil/English translation engine, admin portal, streak tracker. | ₹ 45,000 |
| **BigRock VPS Infrastructure Setup** | Server hardening, OS configuration, Nginx setup, Gunicorn/Uvicorn systemd services, domain mapping for `tnteachers.in`. | ₹ 5,000 |
| **Total One-Time Investment** | **Complete Production-Ready Delivery** | **₹ 50,000** |

---

### 5.2. Recurring Infrastructure & Operating Costs

| Item | Service Provider | Billing Frequency | Estimated Cost (INR ₹) |
| :--- | :--- | :--- | :--- |
| **Domain Registration (`tnteachers.in`)** | BigRock | Annual | ~ ₹ 699 / Year |
| **BigRock VPS Hosting Server** *(4 vCPU, 8 GB RAM, 100 GB NVMe SSD)* | BigRock VPS | Monthly / Annual | ~ ₹ 1,499 / Month  <br>*(or ~ ₹ 17,988 / Year)* |
| **SSL Security Certificate** | Let's Encrypt | Recurring (Auto-renew) | **₹ 0 (FREE)** |
| **Google Gemini AI Engine** | Google AI Studio | Monthly | **₹ 0 (FREE Tier)** |
| **Total Estimated Annual Infrastructure Cost** | **BigRock Server + Domain (`tnteachers.in`)** | **Annual** | **~ ₹ 18,687 / Year** |

---

### 5.3. Optional Annual Maintenance & Support (AMC)

| Service Package | Scope of Work | Cost (INR ₹) |
| :--- | :--- | :--- |
| **Annual Maintenance Contract (AMC)** | Monthly database backups, security patches, uptime monitoring, minor content updates, technical support. | ₹ 12,000 / Year |

---

## 6. Hosting Infrastructure Architecture (BigRock VPS)

```
Client Browser ---> DNS (tnteachers.in) ---> Nginx Reverse Proxy (Port 443 SSL)
                                                 |---> React Static App (dist)
                                                 |---> FastAPI Backend (Port 8000) ---> Database & Gemini AI API
```

---

## 7. BigRock VPS Production Deployment Steps (`tnteachers.in`)

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

### Step 4: Configure Nginx & SSL for `tnteachers.in`
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

## 8. Executive Conclusion

The **TET Platform** (`tnteachers.in`) offers an enterprise-grade learning portal at an exceptionally cost-effective price point. By leveraging Google's **FREE Gemini AI tier** and **BigRock VPS Hosting**, the client obtains a high-capacity platform with zero API overheads and minimal infrastructure costs.
