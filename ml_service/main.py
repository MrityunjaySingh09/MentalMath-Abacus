from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import learner_model

app = FastAPI(title="MENTALMATH ML Microservice", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    historical_accuracy: float
    avg_response_time_sec: float
    number_of_digits: int
    carry_count: int
    borrow_count: int
    operand_count: int

class PredictResponse(BaseModel):
    p_correct: float
    recommended_challenge_level: str

class TrainRequest(BaseModel):
    features: list[list[float]]
    labels: list[int]

@app.get("/healthcheck")
def healthcheck():
    return {"status": "ok", "service": "MENTALMATH ML Microservice"}

@app.post("/predict_success", response_model=PredictResponse)
def predict_success(req: PredictRequest):
    features = [
        req.historical_accuracy,
        req.avg_response_time_sec,
        req.number_of_digits,
        req.carry_count,
        req.borrow_count,
        req.operand_count,
    ]
    p_correct = learner_model.predict_p_correct(features)
    
    if p_correct > 0.85:
      challenge = "INCREASE_DIFFICULTY"
    elif p_correct < 0.55:
      challenge = "DECREASE_DIFFICULTY"
    else:
      challenge = "OPTIMAL_ZONE"

    return PredictResponse(p_correct=p_correct, recommended_challenge_level=challenge)

@app.post("/train_model")
def train_model(req: TrainRequest):
    learner_model.train(req.features, req.labels)
    return {"status": "trained", "samples_received": len(req.labels)}
