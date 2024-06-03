from flask import Flask, request, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import random
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Carica le variabili d'ambiente dal file .env
load_dotenv()
MONGO_URI = 'mongodb://localhost:27017/'

# Configura la connessione a MongoDB
client = MongoClient(MONGO_URI)
db = client["POKEDB"]

# Collezioni
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
    if 'number' not in data:
        return jsonify({"error": "Invalid data"}), 400
    
    user = {
        "number": data['number'],
        "decks": []
    }
    
    users_collection.insert_one(user)
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/decks', methods=['POST'])
def create_deck():
    data = request.get_json()
    if 'user_id' not in data or 'deck_name' not in data or 'cards' not in data:
        return jsonify({"error": "Invalid data"}), 400
    
    deck = {
        "user_id": ObjectId(data['user_id']),
        "deck_name": data['deck_name'],
        "cards": data['cards']
    }
    
    result = decks_collection.insert_one(deck)
    deck_id = result.inserted_id
    users_collection.update_one(
        {"_id": ObjectId(deck['user_id'])},
        {"$push": {"decks": deck_id}}
    )
    
    return jsonify({"message": "Deck created successfully", "deck_id": str(deck_id)}), 201

@app.route('/users/<user_id>/decks', methods=['GET'])
def get_user_decks(user_id):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    user_decks = decks_collection.find({"user_id": ObjectId(user_id)})
    decks = []
    for deck in user_decks:
        decks.append({
            "deck_name": deck['deck_name'],
            "cards": deck['cards']
        })
    
    return jsonify(decks), 200

@app.route('/decks/<deck_id>', methods=['PUT'])
def update_deck(deck_id):
    data = request.get_json()
    update_data = {}
    
    if 'deck_name' in data:
        update_data['deck_name'] = data['deck_name']
    if 'cards' in data:
        update_data['cards'] = data['cards']
    
    decks_collection.update_one({"_id": ObjectId(deck_id)}, {"$set": update_data})
    return jsonify({"message": "Deck updated successfully"}), 200

@app.route('/decks/<deck_id>', methods=['DELETE'])
def delete_deck(deck_id):
    deck = decks_collection.find_one({"_id": ObjectId(deck_id)})
    if not deck:
        return jsonify({"error": "Deck not found"}), 404

    decks_collection.delete_one({"_id": ObjectId(deck_id)})
    users_collection.update_one(
        {"_id": deck['user_id']},
        {"$pull": {"decks": ObjectId(deck_id)}}
    )
    return jsonify({"message": "Deck deleted successfully"}), 200

@app.route('/cards', methods=['GET'])
def get_all_cards():
    cards = cards_collection.find()
    cards_list = []
    for card in cards:
        card['_id'] = str(card['_id'])  # Convert ObjectId to string
        cards_list.append(card)
    return jsonify(cards_list), 200

if __name__ == '__main__':
    app.run(debug=True)
