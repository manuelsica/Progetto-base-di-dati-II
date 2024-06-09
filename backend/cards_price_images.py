import pandas as pd
import requests
import concurrent.futures

# Carica il file CSV
file_path = 'backend/carte.csv' 
df = pd.read_csv(file_path)

# Funzione per recuperare i dati di una singola carta dall'API di Pokemon TCG
def get_pokemon_card_data(card_id):
    url = f'https://api.pokemontcg.io/v2/cards/{card_id}'
    headers = {'X-Api-Key': '316d792f-ad9e-40ca-80ea-1578dfa9146d'} 
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json().get('data', {})
        price = data.get('tcgplayer', {}).get('prices', {}).get('holofoil', {}).get('market', None)
        image_url = data.get('images', {}).get('large', None)
        return card_id, price, image_url
    else:
        print(f"Errore nell'accesso all'API per la carta {card_id}: {response.status_code}")
        return card_id, None, None

# Recupera i dati per ogni carta nel DataFrame usando il multithreading
prices = {}
images = {}

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    future_to_card_id = {executor.submit(get_pokemon_card_data, card_id): card_id for card_id in df['id']}
    
    for future in concurrent.futures.as_completed(future_to_card_id):
        card_id = future_to_card_id[future]
        try:
            card_id, price, image_url = future.result()
            prices[card_id] = price
            images[card_id] = image_url
            print(f"Elaborazione ID carta {card_id} completata.")
        except Exception as exc:
            print(f"Errore nell'elaborazione della carta {card_id}: {exc}")

# Aggiungi le nuove colonne al DataFrame
df['prezzo'] = df['id'].map(prices)
df['immagine'] = df['id'].map(images)

# Conta il numero di carte senza immagini
num_no_image = df['immagine'].isna().sum()
print(f"Numero di carte senza immagini: {num_no_image}")

# Salva il nuovo CSV
new_file_path = 'backend/carte_updated.csv'  
df.to_csv(new_file_path, index=False)

print("Nuovo file CSV salvato con successo:", new_file_path)
