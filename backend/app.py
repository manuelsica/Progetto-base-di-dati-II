from flask import Flask, request, jsonify, session
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import random
from bson.objectid import ObjectId
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Set the secret key from the environment variable
app.secret_key = os.getenv('SECRET_KEY', 'default_secret_key')

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
        session['user_id'] = user['code']
        session.modified = True
        print(f"Session created with user_id: {session['user_id']}")  # Log session creation
        return jsonify({"success": True, "message": "Login successful", "session_id": session['user_id']}), 200

    return jsonify({"success": False, "message": "Invalid code"}), 401

@app.route('/check-login', methods=['POST'])
def check_login():
    user_id = session.get('user_id')
    print(f"Session check, user_id: {user_id}")  # Improved logging
    if user_id:
        return jsonify({"loggedIn": True, "session_id": user_id})
    return jsonify({"loggedIn": False})

@app.route('/logout', methods=['POST'])
def logout():
    session_id = session.pop('user_id', None)
    print(f"Session ended for user_id: {session_id}")
    return jsonify({"message": "Logout successful"})

if __name__ == '__main__':
    app.run(debug=True)
