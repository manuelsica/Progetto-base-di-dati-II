import pandas as pd
import requests
import concurrent.futures

# Funzione per recuperare i dati di una singola carta dall'API di Pokemon TCG
def get_pokemon_card_data(card):
    card_id = card['id']
    card_data = {
        'id': card.get('id', None),
        'name': card.get('name', None),
        'supertype': card.get('supertype', None),
        'subtypes': ', '.join(card.get('subtypes', [])),
        'hp': card.get('hp', None),
        'types': ', '.join(card.get('types', [])),
        'evolvesTo': ', '.join(card.get('evolvesTo', [])),
        'rules': ', '.join(card.get('rules', [])),
        'attacks': ', '.join([attack['name'] for attack in card.get('attacks', [])]),
        'weaknesses': ', '.join([weakness['type'] for weakness in card.get('weaknesses', [])]),
        'retreatCost': ', '.join(card.get('retreatCost', [])),
        'set_id': card.get('set', {}).get('id', None),
        'set_name': card.get('set', {}).get('name', None),
        'rarity': card.get('rarity', None),
        'nationalPokedexNumbers': ', '.join(map(str, card.get('nationalPokedexNumbers', []))),
        'image_url': card.get('images', {}).get('large', None),
        'price': card.get('tcgplayer', {}).get('prices', {}).get('holofoil', {}).get('market', None)
    }
    return card_data

# Funzione per recuperare tutti i set dall'API di Pokemon TCG
def get_all_pokemon_sets():
    print("Recupero tutti i set...")
    url = 'https://api.pokemontcg.io/v2/sets'
    headers = {'X-Api-Key': '316d792f-ad9e-40ca-80ea-1578dfa9146d'} 
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json().get('data', [])
        sets_data = []
        for set_item in data:
            set_data = {
                'id': set_item.get('id', None),
                'name': set_item.get('name', None),
                'series': set_item.get('series', None),
                'printedTotal': set_item.get('printedTotal', None),
                'total': set_item.get('total', None),
                'legalities': ', '.join([k for k, v in set_item.get('legalities', {}).items() if v == 'Legal']),
                'ptcgoCode': set_item.get('ptcgoCode', None),
                'releaseDate': set_item.get('releaseDate', None),
                'updatedAt': set_item.get('updatedAt', None),
                'symbol': set_item.get('images', {}).get('symbol', None),
                'logo': set_item.get('images', {}).get('logo', None)
            }
            sets_data.append(set_data)
        print(f"Recuperati {len(sets_data)} set.")
        return sets_data
    else:
        print(f"Errore nell'accesso all'API: {response.status_code}")
        return []

# Funzione per recuperare tutte le carte con paginazione
def get_all_pokemon_cards():
    all_cards = []
    url = 'https://api.pokemontcg.io/v2/cards'
    headers = {'X-Api-Key': '316d792f-ad9e-40ca-80ea-1578dfa9146d'} 
    params = {'pageSize': 250}  # Numero massimo di carte per pagina
    page = 1

    while True:
        print(f"Recupero pagina {page}...")
        params['page'] = page
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json().get('data', [])
            if not data:
                break
            all_cards.extend(data)
            print(f"Pagina {page} recuperata con successo.")
            page += 1
        else:
            print(f"Errore nell'accesso all'API: {response.status_code}")
            break

    print(f"Recuperate un totale di {len(all_cards)} carte.")
    return all_cards

# Recupera tutte le carte
all_cards_data = get_all_pokemon_cards()

# Processa i dati delle carte
processed_cards = []
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    future_to_card_data = {executor.submit(get_pokemon_card_data, card): card['id'] for card in all_cards_data}
    
    for i, future in enumerate(concurrent.futures.as_completed(future_to_card_data)):
        try:
            card_data = future.result()
            if card_data:
                processed_cards.append(card_data)
                print(f"Elaborazione ID carta {card_data['id']} completata ({i + 1}/{len(all_cards_data)}).")
        except Exception as exc:
            card_id = future_to_card_data[future]
            print(f"Errore nell'elaborazione della carta {card_id}: {exc}")

# Crea un DataFrame dai dati delle carte processate
df_cards = pd.DataFrame(processed_cards)

# Recupera tutti i set
sets_data = get_all_pokemon_sets()

# Crea un DataFrame dai dati dei set
df_sets = pd.DataFrame(sets_data)

# Sostituisci NaN con None per convertire a undefined in JavaScript
df_cards = df_cards.where(pd.notnull(df_cards), None)
df_sets = df_sets.where(pd.notnull(df_sets), None)

# Salva i nuovi CSV
cards_file_path = 'backend/carte_api.csv'
sets_file_path = 'backend/sets_api.csv'
print("Salvataggio dei file CSV...")
df_cards.to_csv(cards_file_path, index=False)
df_sets.to_csv(sets_file_path, index=False)

print("Nuovi file CSV salvati con successo:")
print(f"Carte: {cards_file_path}")
print(f"Set: {sets_file_path}")
