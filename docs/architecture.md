# MENTALMATH — System Architecture

## Architecture Overview

MENTALMATH is built as a full-stack, hostable application with a Next.js 14 core and a Python FastAPI ML microservice.

```
+-------------------------------------------------------+
|                Frontend (Next.js 14)                  |
|   React 18, TypeScript, Tailwind CSS, Recharts        |
+---------------------------+---------------------------+
                            |
                 REST APIs / Client HTTP
                            |
+---------------------------v---------------------------+
|               Next.js App Router Backend              |
| • Deterministic Math Question Generator               |
| • Creator Technique Engine & Step Decomposer          |
| • 8-Level Mental Abacus Visualization Controller      |
| • Creator Benchmark Evaluator Engine                  |
+---------------------------+---------------------------+
                            |
       +--------------------+--------------------+
       |                                         |
+------v--------------+                 +--------v--------------+
| Prisma ORM          |                 | Python FastAPI        |
| PostgreSQL / SQLite |                 | ML Microservice       |
| Database Layer      |                 | scikit-learn Learner  |
+---------------------+                 +-----------------------+
```

## Key Design Principles

1. **Deterministic Math Calculation**: Math answers are never produced by non-deterministic models.
2. **Internalized Bead Visualization**: 8 levels of visual exposure gradually transition users from physical beads to mental representations.
3. **Creator Technique Preservation**: Enforces exact place-value decomposition (e.g. $237 \times 24 = 237 \times 20 + 237 \times 4$).
4. **Hostable Free Stack**: Compatible with Vercel, Neon/Supabase PostgreSQL, and Render Python free tiers with 0 paid API costs.
