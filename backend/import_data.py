import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Carica le variabili d'ambiente dal file .env
load_dotenv()
MONGO_URI = 'mongodb://localhost:27017/'

# Configura la connessione a MongoDB
client = MongoClient(MONGO_URI)
db = client["POKEDB"]
cards_collection = db["cards"]

# Importa il CSV
cards_df = pd.read_csv('carte.csv')

# Converti il DataFrame in un dizionario e inserisci i dati nel database
cards_collection.insert_many(cards_df.to_dict('records'))

print("Cards imported successfully")
