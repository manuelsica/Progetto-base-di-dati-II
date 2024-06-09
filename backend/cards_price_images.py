import pandas as pd
import requests

# Carica il file CSV
file_path = 'backend/carte.csv'  # Sostituisci con il percorso corretto del tuo file
df = pd.read_csv(file_path)

# Funzione per recuperare i dati dall'API di Pokemon TCG con paginazione
def get_all_pokemon_card_data():
    url = 'https://api.pokemontcg.io/v2/cards'
    headers = {'X-Api-Key': '316d792f-ad9e-40ca-80ea-1578dfa9146d'}  # Sostituisci 'YOUR_API_KEY' con la tua chiave API
    params = {'pageSize': 250}  # Dimensione della pagina per limitare il numero di richieste
    all_cards_data = []
    
    while url:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            all_cards_data.extend(data['data'])
            url = data.get('nextPage', None)  # Ottieni l'URL della pagina successiva
        else:
            raise Exception(f"Errore nell'accesso all'API: {response.status_code}")
    
    return all_cards_data

# Recupera tutti i dati dall'API
cards_data = get_all_pokemon_card_data()

# Crea dizionari per prezzi e URL delle immagini
price_dict = {card['id']: card.get('tcgplayer', {}).get('prices', {}).get('holofoil', {}).get('market', None) for card in cards_data}
image_url_dict = {card['id']: card.get('images', {}).get('large', None) for card in cards_data}

# Aggiungi le nuove colonne al DataFrame
df['prezzo'] = df['id'].map(price_dict)
df['immagine'] = df['id'].map(image_url_dict)

# Salva il nuovo CSV
new_file_path = 'backend/carte_updated.csv'  # Sostituisci con il percorso desiderato per salvare il nuovo file
df.to_csv(new_file_path, index=False)

print("Nuovo file CSV salvato con successo:", new_file_path)
