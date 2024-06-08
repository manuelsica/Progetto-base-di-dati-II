from flask import Flask, request, jsonify, session
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import random
from bson.objectid import ObjectId
from flask_cors import CORS
from flask_session import Session 

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = "a6ba480e3683129499e34b02a106e078"
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
Session(app)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})

# Set the secret key from the environment variable


MONGO_URI = 'mongodb://localhost:27017/'

client = MongoClient(MONGO_URI)
db = client["POKEDB"]

users_collection = db["users"]
decks_collection = db["decks"]
cards_collection = db["cards"]



@app.route('/')
def home():
    return "Welcome to the Pokemon Collection API"

@app.route('/generate-code', methods=['POST'])
def generate_code():
    code = random.randint(100000, 999999)
    return jsonify({'code': code})

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    if 'code' not in data:
        return jsonify({"error": "Invalid data"}), 400
    
    user = {
        "code": int(data['code']),
        "decks": []
    }
    
    users_collection.insert_one(user)
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(f"Login attempt with data: {data}")  # Log received data
    if 'code' not in data:
        return jsonify({"error": "Invalid data"}), 400
    
    try:
        code = int(data['code'])
    except ValueError:
        return jsonify({"error": "Code must be an integer"}), 400
    
   
    user = users_collection.find_one({"code": code})
    
    if user:
        session['user'] = user['code']
        print(f"Session created with user_id: {session['user']}")  # Log session creation
        return jsonify({"success": True, "message": "Login successful", "session_id": session['user']}), 200

    return jsonify({"success": False, "message": "Invalid code"}), 401

@app.route('/status', methods=['GET'])
def status():
    user = session.get('user')
    print("Session", user)
    if user:
        return jsonify({'logged_in': True, 'user': user})
    return jsonify({'logged_in': False})


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'message': 'Logout successful'})

if __name__ == '__main__':
    app.run(debug=True)
