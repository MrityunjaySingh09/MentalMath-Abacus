import numpy as np
from sklearn.linear_model import LogisticRegression

class LearnerModel:
    def __init__(self):
        # Baseline logistic regression for probability of solving problem correctly
        self.model = LogisticRegression()
        # Initialize with synthetic baseline weights until real user log data accumulates
        self.X_init = np.array([
            # [hist_acc, avg_rt_sec, num_digits, carry_count, borrow_count, operand_count]
            [0.95, 1.2, 2, 0, 0, 2],
            [0.90, 1.8, 2, 1, 0, 2],
            [0.80, 2.5, 3, 2, 0, 2],
            [0.60, 3.8, 3, 3, 1, 3],
            [0.40, 5.0, 4, 4, 2, 4],
            [0.20, 7.5, 4, 5, 3, 4],
        ])
        self.y_init = np.array([1, 1, 1, 0, 0, 0])
        self.model.fit(self.X_init, self.y_init)

    def predict_p_correct(self, features: list[float]) -> float:
        """
        Features: [historical_accuracy, avg_response_time_sec, num_digits, carry_count, borrow_count, operand_count]
        """
        X = np.array([features])
        probs = self.model.predict_proba(X)
        return float(probs[0][1])

    def train(self, X_train: list[list[float]], y_train: list[int]) -> dict:
        """
        Train the model keeping the 6 synthetic baseline rows in the training set (append real data to them).
        Guards against the case where all labels are the same class (skips training and returns a message).
        """
        if not y_train or len(y_train) == 0:
            return {"status": "skipped", "reason": "No training samples provided"}

        # Guard against the case where all labels are the same class
        unique_labels = set(y_train)
        if len(unique_labels) <= 1:
            return {
                "status": "skipped",
                "reason": f"All {len(y_train)} sample labels belong to the same class ({list(unique_labels)[0]}); training skipped to avoid class collapse",
            }

        try:
            X_real = np.array(X_train)
            y_real = np.array(y_train)

            # Keep the 6 synthetic baseline rows and append real data to them
            X_combined = np.vstack([self.X_init, X_real])
            y_combined = np.concatenate([self.y_init, y_real])

            self.model.fit(X_combined, y_combined)
            return {
                "status": "trained",
                "reason": f"Successfully trained model on {len(y_real)} real samples combined with 6 baseline rows",
            }
        except Exception as e:
            return {"status": "skipped", "reason": str(e)}

learner_model = LearnerModel()
