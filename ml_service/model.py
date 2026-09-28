import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

class LearnerModel:
    def __init__(self):
        # Baseline logistic regression for probability of solving problem correctly
        self.model = LogisticRegression()
        # Initialize with synthetic baseline weights until real user log data accumulates
        X_init = np.array([
            # [hist_acc, avg_rt_sec, num_digits, carry_count, borrow_count, operand_count]
            [0.95, 1.2, 2, 0, 0, 2],
            [0.90, 1.8, 2, 1, 0, 2],
            [0.80, 2.5, 3, 2, 0, 2],
            [0.60, 3.8, 3, 3, 1, 3],
            [0.40, 5.0, 4, 4, 2, 4],
            [0.20, 7.5, 4, 5, 3, 4],
        ])
        y_init = np.array([1, 1, 1, 0, 0, 0])
        self.model.fit(X_init, y_init)

    def predict_p_correct(self, features: list[float]) -> float:
        """
        Features: [historical_accuracy, avg_response_time_sec, num_digits, carry_count, borrow_count, operand_count]
        """
        X = np.array([features])
        probs = self.model.predict_proba(X)
        return float(probs[0][1])

    def train(self, X_train: list[list[float]], y_train: list[int]):
        if len(X_train) >= 10:
            self.model.fit(X_train, y_train)

learner_model = LearnerModel()
