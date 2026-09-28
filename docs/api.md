# MENTALMATH — REST API Specification

## Endpoints

### 1. Deterministic Question Generation
- **POST** `/api/questions/generate`
- **Request Body**:
  ```json
  {
    "operation": "ADDITION",
    "difficulty": "MEDIUM"
  }
  ```
- **Response**: Question payload with operands, metadata (digits, carries, borrows), and step-by-step technique breakdown.

### 2. Attempt Submission & Adaptive Log
- **POST** `/api/attempts`
- **Request Body**:
  ```json
  {
    "questionId": "q_123",
    "operation": "ADDITION",
    "difficulty": "EASY",
    "userAnswer": "1296",
    "correctAnswer": "1296",
    "isCorrect": true,
    "responseTimeMs": 1420,
    "selectedTechnique": "Chunked Addition"
  }
  ```

### 3. Creator Benchmark Profile
- **GET** `/api/benchmark`
- **Response**: Standardized Creator Reference Profile metrics across all 6 core arithmetic categories.
