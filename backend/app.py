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


load_dotenv()

app = Flask(__name__)


app.config['JWT_SECRET_KEY'] = os.getenv("SECRET_KEY", "a6ba480e3683129499e34b02a106e078")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)


jwt = JWTManager(app)


CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})


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
    print(f"Generated code: {code}")  
    return jsonify({'code': code})

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    print(f"Register data received: {data}")  
    if 'code' not in data:
        return jsonify({"error": "Invalid data"}), 400

    user = {
        "code": int(data['code']),
        "decks": []
    }

    users_collection.insert_one(user)
    print(f"User registered with code: {data['code']}")  
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(f"Login data received: {data}") 
    if 'code' not in data:
        return jsonify({"error": "Invalid data"}), 400

    try:
        code = int(data['code'])
    except ValueError:
        return jsonify({"error": "Code must be an integer"}), 400

    user = users_collection.find_one({"code": code})

    if user:
        access_token = create_access_token(identity={'code': user['code']})
        print(f"Login successful for code: {code}") 
        return jsonify({"success": True, "message": "Login successful", "access_token": access_token}), 200

    print(f"Login failed for code: {code}")  
    return jsonify({"success": False, "message": "Invalid code"}), 401

@app.route('/status', methods=['GET'])
@jwt_required()
def status():
    current_user = get_jwt_identity()
    print(f"Status check for user: {current_user}") 
    return jsonify({'logged_in': True, 'user': current_user})

@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({'message': 'Logout successful'})
    response.delete_cookie('access_token')
    print("User logged out") 
    return response

@app.route('/decks', methods=['GET'])
@jwt_required()
def get_decks():
    current_user = get_jwt_identity()
    user = users_collection.find_one({"code": current_user['code']})
    decks = user.get("decks", [])
    print(f"Decks for user {current_user['code']}: {decks}") 
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
    print(f"Added new deck {new_deck_name} for user {current_user['code']}")  
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
    print(f"Renamed deck {deck_id} to {new_name} for user {current_user['code']}")  
    return jsonify({"message": "Deck renamed", "deck": {"id": deck_id, "name": new_name}}), 200

@app.route('/decks/<int:deck_id>', methods=['DELETE'])
@jwt_required()
def delete_deck(deck_id):
    current_user = get_jwt_identity()
    user = users_collection.find_one({"code": current_user['code']})
    decks = user.get("decks", [])
    deck_to_delete = next((deck for deck in decks if deck["id"] == deck_id), None)

    if deck_to_delete:
        # Rimuovi le carte associate al mazzo
        card_ids = deck_to_delete.get("cards", [])
        for card_id in card_ids:
            cards_collection.delete_one({"_id": ObjectId(card_id)})

        # Rimuovi il mazzo dall'utente
        decks = [deck for deck in decks if deck["id"] != deck_id]
        users_collection.update_one({"code": current_user['code']}, {"$set": {"decks": decks}})
        print(f"Deleted deck {deck_id} for user {current_user['code']}")  
        return jsonify({"message": "Deck deleted"}), 200
    else:
        return jsonify({"message": "Deck not found"}), 404

@app.route('/decks/<int:deck_id>/cards', methods=['POST'])
@jwt_required()
def add_card_to_deck(deck_id):
    current_user = get_jwt_identity()
    card_id = request.json.get("cardId")
    user = users_collection.find_one({"code": current_user['code']})
    decks = user.get("decks", [])

    for deck in decks:
        if deck["id"] == deck_id:
            card_count = deck.get("cards", []).count(card_id)

            if card_count >= 4:
                card_details = cards_collection.find_one({"_id": ObjectId(card_id)})
                card_supertype = card_details.get('supertype', '')

                if card_supertype != 'Energy':
                    return jsonify({"message": "Card reached max number available!"}), 400

            if len(deck.get("cards", [])) >= 60:
                return jsonify({"message": "Deck has reached 60 cards."}), 400

            deck.setdefault("cards", []).append(card_id)
            break

    users_collection.update_one({"code": current_user['code']}, {"$set": {"decks": decks}})
    return jsonify({"message": f"Card {card_id} added to '{deck_id}' ", "card": card_id}), 200


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

    # Rimuovi la carta dal database
    cards_collection.delete_one({"_id": ObjectId(card_id)})

    users_collection.update_one({"code": current_user['code']}, {"$set": {"decks": decks}})
    return jsonify({"message": f"Card {card_id} removed from '{deck_id}' "}), 200

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
            query['set.name'] = selected_set
        if selected_type:
            query['types'] = selected_type
        if selected_supertype:
            query['supertype'] = selected_supertype

        total_cards = cards_collection.count_documents(query)
        cards = list(cards_collection.find(query).skip((page - 1) * page_size).limit(page_size))
        cards = json_serializable(cards)

        return jsonify({
            'data': cards,
            'totalCount': total_cards,
            'currentPage': page,
            'totalPages': math.ceil(total_cards / page_size)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/sets', methods=['GET'])
def get_sets():
    try:
        sets = sets_collection.distinct('name')
        return jsonify({'data': sets})
    except Exception as e:
        print(f"Error: {str(e)}")  
        return jsonify({'error': str(e)}), 500

@app.route('/db_sets', methods=['GET'])
def get_db_sets():
    try:
        sets = list(sets_collection.find({}))
        sets = json_serializable(sets)
        return jsonify({'data': sets})
    except Exception as e:
        print(f"Error: {str(e)}")  
        return jsonify({'error': str(e)}), 500

@app.route('/random-card-images', methods=['GET'])
def get_random_card_images():
    try:
        cards = list(cards_collection.find({}, {'images.large': 1}))
        images = [card['images']['large'] for card in cards if 'images' in card and 'large' in card['images']]
        return jsonify({'data': images})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/cards/<string:card_id>', methods=['GET'])
def get_card_details(card_id):
    try:
        card = cards_collection.find_one({"_id": ObjectId(card_id)})
        if card:
            card = json_serializable(card)
            return jsonify({'data': card})
        else:
            return jsonify({'error': 'Card not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/db_sets/<string:set_id>/cards', methods=['GET'])
def get_cards_by_set(set_id):
    try:
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('pageSize', 30))
        search = request.args.get('search', '')
        selected_type = request.args.get('type', '')
        selected_supertype = request.args.get('supertype', '')

        query = {'set.id': set_id}
        if search:
            query['name'] = {'$regex': search, '$options': 'i'}
        if selected_type:
            query['types'] = selected_type
        if selected_supertype:
            query['supertype'] = selected_supertype

        total_cards = cards_collection.count_documents(query)
        cards = list(cards_collection.find(query).skip((page - 1) * page_size).limit(page_size))
        cards = json_serializable(cards)

        return jsonify({
            'data': cards,
            'totalCount': total_cards,
            'currentPage': page,
            'totalPages': math.ceil(total_cards / page_size)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/db_sets/<string:set_id>', methods=['GET'])
def get_set_details(set_id):
    try:
        set_details = sets_collection.find_one({"id": set_id})
        if set_details:
            set_details = json_serializable(set_details)
            return jsonify({'data': set_details})
        else:
            return jsonify({'error': 'Set not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/paradox-rift-pokemon-images', methods=['GET'])
def get_paradox_rift_pokemon_images():
    try:
        query = {
            'set.name': 'Paradox Rift',
            'supertype': 'Pokémon'
        }
        cards = list(cards_collection.find(query, {'images.large': 1}))
        images = [card['images']['large'] for card in cards if 'images' in card and 'large' in card['images']]
        return jsonify({'data': images})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
