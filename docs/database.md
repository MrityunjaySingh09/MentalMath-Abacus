# MENTALMATH — Database Schema & Data Models

## Entities & Models

### `User`
- `id`: String (UUID PK)
- `email`: String (Unique)
- `name`: String
- `passwordHash`: String

### `UserSkill`
- `userId`: FK to User
- `operation`: ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION, VISUALIZATION, TABLE_MASTERY
- `skillLevel`: Float
- `accuracy`: Float
- `avgResponseTimeMs`: Float

### `Attempt`
- `id`: String (UUID PK)
- `questionId`: String
- `operation`: String
- `difficulty`: String
- `correctAnswer`: String
- `userAnswer`: String
- `isCorrect`: Boolean
- `responseTimeMs`: Int
- `carryCount`: Int
- `borrowCount`: Int
- `numberOfDigits`: Int
- `selectedTechnique`: String

### `BenchmarkProfile`
- `id`: String (UUID PK)
- `isCreatorProfile`: Boolean
- `accuracy`: Float
- `avgResponseTimeMs`: Float
- `qpm`: Float
- `operationStatsJson`: JSON payload
