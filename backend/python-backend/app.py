from flask import Flask, request, jsonify
import numpy as np
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler

app = Flask(__name__)

# Load the trained model and scaler
model = load_model('battery_model.h5')
scaler = MinMaxScaler()

# API endpoint for prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data from the request
        input_data = request.json['input_data']

        # Preprocess input data
        input_data_scaled = scaler.fit_transform(np.array(input_data).reshape(-1, 1)).reshape(-1, 1, 1)

        # Make prediction
        prediction_scaled = model.predict(input_data_scaled)

        # Inverse transform the prediction
        prediction = scaler.inverse_transform(prediction_scaled)

        return jsonify({'prediction': prediction.flatten().tolist()})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
