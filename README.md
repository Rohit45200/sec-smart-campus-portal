# Sengunthar Engineering College (Autonomous)
## Smart Campus ERP Portal & Autonomous Multi-Agent Academic Copilot

An institutional-grade, full-stack campus management and academic intelligence platform engineered for **Sengunthar Engineering College (Autonomous), Tiruchengode**. Approved by AICTE, affiliated with Anna University, and accredited with NAAC 'A' Grade.

---

## 🌟 Key Highlights & System Capabilities

### 1. Multi-Agent Autonomous Academic Copilot (ReAct Pattern)
* Engineered an autonomous multi-agent reasoning system implementing the **ReAct (Thought ➔ Action ➔ Observation ➔ Synthesis)** architectural framework.
* Specialized domain sub-agents:
  * **Omni Master Router**: Dispatches student queries to appropriate domain tools.
  * **Attendance Guardian**: Computes 75% statutory compliance, analyzes subject-wise risk, and calculates exact missable hours (*Safe-Bunk* algorithms).
  * **CGPA & Academic Advisor**: Simulates target CGPA scenarios based on Anna University 10-point scale.
  * **Placement & Eligibility Navigator**: Evaluates corporate criteria (e.g. Zoho, TCS Digital, Amazon) against student standing and backlogs.
  * **Campus Life & OD Secretary**: Automatically generates official on-duty approval passes and formal college absence letters.

### 2. Retrieval-Augmented Generation (Vector RAG Knowledge Hub)
* Ingests and chunks official **Sengunthar Autonomous Regulations 2024**.
* High-dimensional semantic vector embeddings with cosine similarity matching.
* Provides verifiable citations and clause references for attendance rules, condonation policies, grade moderation, and examination revaluation.

### 3. Comprehensive Academic ERP Modules
* **Biometric Attendance Tracker**: 91.8% real-time tracking, period-wise biometric history, and 75% mandatory threshold alerts.
* **Autonomous Academic Records**: Semester 1–7 SGPA breakdown, cumulative CGPA calculation (8.84), internal vs. external marks breakdown.
* **COE Examination Hall Ticket**: Official admit card with scannable barcode, candidate registration number, exam session schedules, and chief superintendent instructions.
* **Timetable & Weekly Routines**: Daily period scheduling, lab session locations, and faculty mapping.
* **Fees & E-Receipts**: Tuition fees, examination dues, online transaction logs, and printable fee receipts.
* **Notices & Circulars**: Categorized administrative bulletins (Exam Cell, Placement Cell, Events).

### 4. Strict Role-Based Access Control (RBAC) Security
* **Student Role**: Restricted to student dashboards and academic tools. Access to Faculty and Admin modules is hidden and guarded by 403 Forbidden route interceptors.
* **Faculty Role**: Access to OD Approval workflow, faculty attendance marking, and academic evaluations. Admin configuration is restricted.
* **Admin Role**: Universal cross-portal control across student records, faculty approvals, and central ERP systems.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Motion, Lucide Icons |
| **Backend** | Node.js, Express.js, TypeScript (TSX runtime) |
| **Database** | High-performance MongoDB compatible document architecture with optional Atlas clustering |
| **AI / RAG** | Vector Embeddings, ReAct multi-step tool execution, Dense Semantic Search |
| **Build System** | Vite 6, Autoprefixer, ESBuild |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* Node.js (v18 or higher recommended)
* npm (v9 or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/sec-smart-campus-portal.git
   cd sec-smart-campus-portal
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key_here
   # Optional external MongoDB Atlas URI (if omitted, uses built-in database):
   # MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sec_portal
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Deployment (Render / Cloud)

### Build Command:
```bash
npm install && npm run build
```

### Start Command:
```bash
npm start
```

### Required Production Environment Variables:
* `NODE_ENV` = `production`
* `GEMINI_API_KEY` = `your_gemini_api_key`

---

## 👨‍💻 Author & Institutional Credit

* **Institution**: Sengunthar Engineering College (Autonomous)
* **Accreditations**: Approved by AICTE, Affiliated to Anna University, NAAC 'A' Grade
* **Campus Website**: [https://sect.edu.in](https://sect.edu.in)
* **Engineered By**: Autonomous Capstone Engineering Team
