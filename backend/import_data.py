import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
import json
import os


load_dotenv()
MONGO_URI = 'mongodb://localhost:27017/'


client = MongoClient(MONGO_URI)
db = client["POKEDB"]
cards_collection = db["cards"]
sets_collection = db["sets"]


with open('backend/carte_api.json', 'r', encoding='utf-8') as f:
    cards_data = json.load(f)


with open('backend/sets_api.json', 'r', encoding='utf-8') as f:
    sets_data = json.load(f)


sets_collection.insert_many(sets_data)


cards_collection.insert_many(cards_data)

print("Cards and sets imported successfully")
