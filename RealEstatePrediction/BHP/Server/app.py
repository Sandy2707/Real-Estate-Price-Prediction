from flask import Flask, request, jsonify, render_template
import util

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')  # Ensure index.html is in 'templates/' folder

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({'locations': util.get_location_names()})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    data = request.json  # Use JSON instead of form-data
    total_sqft = float(data['total_sqft'])
    location = data['location']
    bhk = int(data['bhk'])
    bath = int(data['bath'])

    response = jsonify({'estimated_price': util.get_estimated_price(location, total_sqft, bhk, bath)})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    print("Flask server is running! Available routes: /, /get_location_names, /predict_home_price")
    util.load_saved_artifacts()
    app.run(debug=True)
