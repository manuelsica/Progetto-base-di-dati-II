import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
import json
import os

# Carica le variabili d'ambiente dal file .env
load_dotenv()
MONGO_URI = 'mongodb://localhost:27017/'

# Configura la connessione a MongoDB
client = MongoClient(MONGO_URI)
db = client["POKEDB"]
cards_collection = db["cards"]
sets_collection = db["sets"]

# Importa i dati delle carte dal file JSON
with open('backend/carte_api.json', 'r', encoding='utf-8') as f:
    cards_data = json.load(f)

# Importa i dati dei set dal file JSON
with open('backend/sets_api.json', 'r', encoding='utf-8') as f:
    sets_data = json.load(f)

# Inserisci i dati dei set nel database
sets_collection.insert_many(sets_data)

# Inserisci i dati delle carte nel database
cards_collection.insert_many(cards_data)

print("Cards and sets imported successfully")
