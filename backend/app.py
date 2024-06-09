import requests
from flask import Flask, request, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import random
from bson import ObjectId
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import math

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
cards_collection = db["cards"]
sets_collection = db["sets"]

def json_serializable(doc):
    if isinstance(doc, list):
        return [json_serializable(d) for d in doc]
    if isinstance(doc, dict):
        return {key: json_serializable(value) for key, value in doc.items()}
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, float) and math.isnan(doc):
        return None
    return doc

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

@app.route('/decks', methods=['GET'])
@jwt_required()
def get_decks():
    current_user = get_jwt_identity()
    user = users_collection.find_one({"code": current_user['code']})
    decks = user.get("decks", [])
    print(f"Decks for user {current_user['code']}: {decks}")  # Debug print
    return jsonify(decks), 200

@app.route('/decks', methods=['POST'])
@jwt_required()
def add_deck():
    current_user = get_jwt_identity()
    user = users_collection.find_one({"code": current_user['code']})
    decks = user.get("decks", [])
    new_deck_id = len(decks) + 1
    new_deck_name = f"Deck {new_deck_id}"
    decks.append({"id": new_deck_id, "name": new_deck_name, "cards": []})
    users_collection.update_one({"code": current_user['code']}, {"$set": {"decks": decks}})
    print(f"Added new deck {new_deck_name} for user {current_user['code']}")  # Debug print
    return jsonify({"message": "Deck added", "deck": {"id": new_deck_id, "name": new_deck_name}}), 201

@app.route('/decks/<int:deck_id>', methods=['PUT'])
@jwt_required()
def rename_deck(deck_id):
    current_user = get_jwt_identity()
    new_name = request.json.get("name", "").strip()
    user = users_collection.find_one({"code": current_user['code']})
    decks = user.get("decks", [])
    for deck in decks:
        if deck["id"] == deck_id:
            deck["name"] = new_name
            break
    users_collection.update_one({"code": current_user['code']}, {"$set": {"decks": decks}})
    print(f"Renamed deck {deck_id} to {new_name} for user {current_user['code']}")  # Debug print
    return jsonify({"message": "Deck renamed", "deck": {"id": deck_id, "name": new_name}}), 200

@app.route('/decks/<int:deck_id>', methods=['DELETE'])
@jwt_required()
def delete_deck(deck_id):
    current_user = get_jwt_identity()
    user = users_collection.find_one({"code": current_user['code']})
    decks = user.get("decks", [])
    decks = [deck for deck in decks if deck["id"] != deck_id]
    users_collection.update_one({"code": current_user['code']}, {"$set": {"decks": decks}})
    print(f"Deleted deck {deck_id} for user {current_user['code']}")  # Debug print
    return jsonify({"message": "Deck deleted"}), 200

@app.route('/decks/<int:deck_id>/cards', methods=['POST'])
@jwt_required()
def add_card_to_deck(deck_id):
    current_user = get_jwt_identity()
    card_id = request.json.get("cardId")
    user = users_collection.find_one({"code": current_user['code']})
    decks = user.get("decks", [])

    for deck in decks:
        if deck["id"] == deck_id:
            card_already_in_deck = card_id in deck.get("cards", [])

            if card_already_in_deck:
                card_details_response = requests.get(f'https://api.pokemontcg.io/v2/cards/{card_id}',
                                                     headers={'X-Api-Key': '316d792f-ad9e-40ca-80ea-1578dfa9146d'})
                card_details = card_details_response.json().get('data', {})
                card_supertype = card_details.get('supertype', '')

                if card_supertype != 'Energy' and card_supertype != 'Trainer':
                    return jsonify({"message": "La carta è già presente nel mazzo"}), 400

            if len(deck.get("cards", [])) >= 60:
                return jsonify({"message": "Il mazzo contiene già 60 carte"}), 400

            deck.setdefault("cards", []).append(card_id)
            break

    users_collection.update_one({"code": current_user['code']}, {"$set": {"decks": decks}})
    return jsonify({"message": f"Carta {card_id} aggiunta al mazzo {deck_id}", "card": card_id}), 200

@app.route('/decks/<int:deck_id>/cards', methods=['GET'])
@jwt_required()
def get_cards_in_deck(deck_id):
    current_user = get_jwt_identity()
    user = users_collection.find_one({"code": current_user['code']})
    decks = user.get("decks", [])

    for deck in decks:
        if deck["id"] == deck_id:
            cards = deck.get("cards", [])
            return jsonify({"cards": cards}), 200

    return jsonify({"message": "Deck not found"}), 404

@app.route('/decks/<int:deck_id>/cards/<string:card_id>', methods=['DELETE'])
@jwt_required()
def remove_card_from_deck(deck_id, card_id):
    current_user = get_jwt_identity()
    user = users_collection.find_one({"code": current_user['code']})
    decks = user.get("decks", [])

    for deck in decks:
        if deck["id"] == deck_id:
            if card_id in deck.get("cards", []):
                deck["cards"].remove(card_id)
                break

    users_collection.update_one({"code": current_user['code']}, {"$set": {"decks": decks}})
    return jsonify({"message": f"Carta {card_id} rimossa dal mazzo {deck_id}"}), 200

@app.route('/cards', methods=['GET'])
def get_cards():
    try:
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('pageSize', 30))
        search = request.args.get('search', '')
        selected_set = request.args.get('set', '')
        selected_type = request.args.get('type', '')
        selected_supertype = request.args.get('supertype', '')

        query = {}
        if search:
            query['name'] = {'$regex': search, '$options': 'i'}
        if selected_set:
            query['set'] = selected_set
        if selected_type:
            query['types'] = selected_type
        if selected_supertype:
            query['supertype'] = selected_supertype

        print(f"Query: {query}")  # Debug log
        total_cards = cards_collection.count_documents(query)
        cards = list(cards_collection.find(query).skip((page - 1) * page_size).limit(page_size))
        cards = json_serializable(cards)
        print(f"Total cards: {total_cards}")  # Debug log

        return jsonify({
            'data': cards,
            'totalCount': total_cards
        })
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug log
        return jsonify({'error': str(e)}), 500

@app.route('/sets', methods=['GET'])
def get_sets():
    try:
        sets = sets_collection.distinct('name')
        return jsonify({'data': sets})
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug log
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
