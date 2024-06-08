from flask import Flask, request, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import random
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Set the secret key for JWT
app.config['JWT_SECRET_KEY'] = os.getenv("SECRET_KEY", "a6ba480e3683129499e34b02a106e078")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize JWT
jwt = JWTManager(app)

# Enable CORS with credentials support
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})

# MongoDB connection
MONGO_URI = 'mongodb://localhost:27017/'
client = MongoClient(MONGO_URI)
db = client["POKEDB"]
users_collection = db["users"]

@app.route('/')
def home():
    return "Welcome to the Pokemon Collection API"

@app.route('/generate-code', methods=['POST'])
def generate_code():
    code = random.randint(100000, 999999)
    print(f"Generated code: {code}")  # Debug print
    return jsonify({'code': code})

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    print(f"Register data received: {data}")  # Debug print
    if 'code' not in data:
        return jsonify({"error": "Invalid data"}), 400
    
    user = {
        "code": int(data['code']),
        "decks": []
    }
    
    users_collection.insert_one(user)
    print(f"User registered with code: {data['code']}")  # Debug print
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(f"Login data received: {data}")  # Debug print
    if 'code' not in data:
        return jsonify({"error": "Invalid data"}), 400
    
    try:
        code = int(data['code'])
    except ValueError:
        return jsonify({"error": "Code must be an integer"}), 400
    
    user = users_collection.find_one({"code": code})
    
    if user:
        access_token = create_access_token(identity={'code': user['code']})
        print(f"Login successful for code: {code}")  # Debug print
        return jsonify({"success": True, "message": "Login successful", "access_token": access_token}), 200

    print(f"Login failed for code: {code}")  # Debug print
    return jsonify({"success": False, "message": "Invalid code"}), 401

@app.route('/status', methods=['GET'])
@jwt_required()
def status():
    current_user = get_jwt_identity()
    print(f"Status check for user: {current_user}")  # Debug print
    return jsonify({'logged_in': True, 'user': current_user})

@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({'message': 'Logout successful'})
    response.delete_cookie('access_token')
    print("User logged out")  # Debug print
    return response

if __name__ == '__main__':
    app.run(debug=True)
