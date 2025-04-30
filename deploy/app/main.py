from flask import (
  Flask, request, jsonify)
from flask_cors import CORS

import torch 
import torch.nn as nun 

app = Flask(__name__)
CORS(app)

# linear module
class SimpleModel (nun.Module):
    def __init__(self): 
        super(SimpleModel, self). __init__() 
        self.linear = nun.Linear(10, 1)
    def forward(self,x):
        return self.linear(x)

# initialize the module
model = SimpleModel() 
# load the module
model.load_state_dict(torch.load('model.pth'))

@app.route('/health', methods=['GET'])
def health():
  return jsonify(status='healthy'), 200

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json['inputs']
    data = torch.tensor(data)
    with torch.no_grad():
        prediction = model(data).tolist()
        return jsonify(prediction=prediction)


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080)
