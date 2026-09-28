# MENTALMATH — Full-Stack Adaptive Mental Calculation Platform

> **Tagline**: *"Train your brain to calculate, don't just calculate with a calculator."*

MENTALMATH is a full-stack mental-arithmetic training platform inspired by internalized abacus calculation and the creator's mental arithmetic methodology. The platform guides users from visible bead manipulation to partial visualization, internalized number representation, and high-speed mental calculation.

---

## 🌟 Core Features

- **Internalized Mental Abacus Visualization**: 8-Level progression suite moving from interactive Soroban abacus to partial exposure, flash exposure (1.5s/1.0s), and numbers-only mental visualization.
- **Creator Technique Library**:
  - **Chunked Addition & Subtraction**: Running mental totals with sequential place-value chunking.
  - **Place-Value Multiplication**: Decomposing multipliers ($237 \times 24 \rightarrow 237 \times 20 + 237 \times 4$) preserving exact place-value decomposition.
  - **Easy-Number Recognition**: Spotting factors like $25, 50, 100, 125, 200, 250, 500, 1000$.
  - **Table Mastery via Fast Reconstruction**: Rapid reconstruction strategies instead of pure memory.
- **Deterministic Math Engine**: 100% accurate, rule-based question generator for Addition, Subtraction, Multiplication, Division, and Visualization modes with digit, carry, and borrow tracking.
- **Adaptive Difficulty & ML Learner Microservice**: Combines operation-specific rule-based thresholds with a Python FastAPI microservice (`scikit-learn`) predicting success probabilities $P(\text{correct} \mid \text{context})$.
- **Creator Benchmark System**: Standardized test suite comparing speed, accuracy, QPM, and streaks against the reference profile.
- **Zero Paid API Requirement**: 100% free and hostable architecture across Vercel, Neon/Supabase PostgreSQL, and Render/Railway Python FastAPI tiers.

---

## 🛠 Tech Stack

- **Frontend & App Server**: Next.js 14 (App Router, React, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide Icons)
- **Database & ORM**: PostgreSQL / SQLite via Prisma ORM
- **ML Microservice**: Python FastAPI, `scikit-learn`, `pandas`, `numpy`
- **AI Math Coach**: Local deterministic technique explanation engine

---

## 🚀 Quick Setup & Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file:
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_ML_SERVICE_URL="http://localhost:8000"
```

### 3. Initialize Prisma Database
```bash
npx prisma db push
```

### 4. Run Next.js Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Python ML Microservice (Optional)
```bash
cd ml_service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:
- [`docs/architecture.md`](file:///d:/DOWNLOADS/Mental%20maths/docs/architecture.md)
- [`docs/ml.md`](file:///d:/DOWNLOADS/Mental%20maths/docs/ml.md)
- [`docs/techniques.md`](file:///d:/DOWNLOADS/Mental%20maths/docs/techniques.md)
- [`docs/api.md`](file:///d:/DOWNLOADS/Mental%20maths/docs/api.md)
- [`docs/database.md`](file:///d:/DOWNLOADS/Mental%20maths/docs/database.md)
