# MENTALMATH — Machine Learning Architecture

## Learner Model Design

The ML layer predicts user success probability:

$$P(\text{correct} \mid \text{user, question, difficulty, context})$$

### Feature Pipeline
- `historical_accuracy`: Historical accuracy percentage.
- `avg_response_time_sec`: Average response speed in seconds.
- `number_of_digits`: Max digit count of problem operands.
- `carry_count`: Number of digit carries required.
- `borrow_count`: Number of digit borrows required.
- `operand_count`: Number of operands in equation.

### Models Used
- Baseline: Logistic Regression (`sklearn.linear_model.LogisticRegression`).
- Enhanced: Random Forest Classifier (`sklearn.ensemble.RandomForestClassifier`).

### Microservice Endpoints
- `POST /predict_success`: Accepts problem feature payload and returns probability $P(\text{correct})$ and challenge recommendation (`INCREASE_DIFFICULTY`, `DECREASE_DIFFICULTY`, `OPTIMAL_ZONE`).
- `POST /train_model`: Retrains model on user attempt log features.
