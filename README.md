# ScholarNest (ScholarNet)

> **Maharashtra & Central Scholarship Discovery, Eligibility & Application Guidance Platform**  
> *"Find. Understand. Apply."*

---

## 📌 Product Overview

ScholarNest is a modern, responsive web application designed to help students discover and understand government scholarships available across **MahaDBT 2.0 (Maharashtra Government)** and **Central Government schemes (NSP / AICTE)**.

### Crucial Platform Boundary
ScholarNest is an **informational guidance and discovery platform**.
* It **never** pretends to be the official government portal.
* It **never** submits applications on behalf of students.
* It **never** guarantees or certifies official eligibility.
* Applications must ultimately be submitted through the appropriate **official government portals** (e.g. [MahaDBT 2.0](https://mahadbt.maharashtra.gov.in/) or [National Scholarship Portal](https://scholarships.gov.in/)).

---

## 🚀 Key Features

1. **Anonymous Eligibility Matcher (No Mandatory Signup)**
   * Students can take a 3-step questionnaire directly from the landing page.
   * Matches against real Maharashtra categories (`OPEN`, `OBC`, `SC`, `ST`, `EWS`, `VJNT`, `SBC`, `Minority`), income thresholds, education level, and marks.
   * Provides immediate, transparent **"Why You Match"** reasons and **"Unmet Requirements"**.

2. **Deterministic Rules Engine**
   * Decoupled pure logic service (`backend/src/services/eligibilityService.js`).
   * Evaluates caste category inclusion, annual family income ceilings, marks/percentages, domicile state, and gender restrictions.
   * 100% explainable matching with zero hallucinations.

3. **Curated Flagship Maharashtra & Central Schemes**
   * **Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC Scheme)** (50% Tuition Fee waiver)
   * **Government of India Post-Matric Scholarship for SC Students** (100% Fee waiver + Maintenance allowance)
   * **Post-Matric Scholarship for OBC Students** (50% Fee waiver + Monthly allowance)
   * **Post-Matric Scholarship for ST Students** (Tribal Development)
   * **Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna** (Hostel Allowance up to ₹30,000/yr)
   * **State Minority Scholarship for Higher & Professional Education** (Up to ₹50,000/yr)
   * **Vimukta Jati and Nomadic Tribes (VJNT) Post-Matric Scholarship**
   * **Central Sector Scheme of Scholarships (NSP PM-USP)**
   * **AICTE Pragati Scholarship for Girls** (₹50,000/year for technical degree/diploma)

4. **Detailed Financial Benefits & Document Checklists**
   * Clear breakdown of tuition reimbursement, maintenance allowances, and hostel grants.
   * Interactive checkable document checklists (Aadhaar, Domicile, Income certificate from Tehsildar, Caste Validity, CAP Allotment letter, Marksheets).
   * Step-by-step application instructions.

5. **Student Portal**
   * Student Dashboard with real-time matching count, saved opportunities, and deadline trackers.
   * Multi-step profile editor with completion percentage calculator.
   * Application status pipeline tracker (`Saved` ➔ `Planning` ➔ `Applied` ➔ `Under Review` ➔ `Selected` / `Rejected`).
   * In-app deadline and update notifications.

6. **Admin Management System**
   * Admin Dashboard with real-time statistics (students, total schemes, active listings, tracked applications).
   * Scholarship CRUD with visual rule builder and document manager.
   * Verification review tracker with last verified dates and official source references.
   * Student account enablement/disablement toggle.

---

## 🛠️ Technology Architecture

* **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, React Router v7, Axios, React-Toastify.
* **Backend**: Node.js, Express.js REST API, Zod validation, JWT authentication, bcryptjs password hashing.
* **Database & ORM**: PostgreSQL with Prisma ORM (`backend/prisma/schema.prisma`), backed by resilient multi-tier data storage.
* **Testing**: Comprehensive unit test suite for deterministic eligibility and production Vite bundle verification.

---

## ⚡ Quick Start

### 1. Prerequisites
* **Node.js**: v18+ (tested on Node v24.19.0)
* **npm**: v9+

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Run Development Servers
```bash
# Run both Backend API and Frontend concurrently
npm run dev

# Or run them individually:
npm run dev:backend    # Express API on http://localhost:5000
npm run dev:frontend   # Vite App on http://localhost:5173
```

### 4. Run Tests & Production Build
```bash
npm test
```

---

## 🔐 Demo Development Accounts

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student** | `student@scholarnest.local` | `Student@123` | Pooja Patil (COEP B.Tech, OBC, Pune, ₹2.2L income) |
| **Admin** | `admin@scholarnest.local` | `Admin@123` | ScholarNest Administrator |

---

## 📂 Project Structure

```
ScolarNest/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Prisma schema for PostgreSQL
│   ├── src/
│   │   ├── controllers/          # Express route controllers (Auth, Profile, Scholarships, Admin, etc.)
│   │   ├── middleware/           # JWT authentication & role authorization
│   │   ├── routes/               # Express API routes
│   │   ├── services/             # Deterministic eligibility evaluation engine
│   │   ├── tests/                # Unit test suite
│   │   ├── db.js                 # Resilient database abstraction layer
│   │   ├── seed.js               # Maharashtra & Central schemes seed script
│   │   └── server.js             # Express server entry point
│   ├── .env                      # Environment configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, ProtectedRoute, LoadingSpinner
│   │   ├── context/              # AuthContext, NotificationContext
│   │   ├── layouts/              # Student Layout, Admin Layout
│   │   ├── pages/                # Landing, Auth, Dashboard, Profile, Scholarships, Detail, Admin
│   │   ├── services/             # Axios API client
│   │   ├── App.jsx               # React Router routes
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── package.json                  # Root monorepo workspace scripts
└── README.md
```

---

## 🛡️ Security & Privacy Notice
* Sensitive identifiers (such as Aadhaar numbers and bank account credentials) are **never** stored or requested on ScholarNest.
* All passwords are encrypted with bcrypt (10 rounds).
* All user authentication is verified via signed JSON Web Tokens (JWT).

