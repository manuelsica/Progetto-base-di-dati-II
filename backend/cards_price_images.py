import pandas as pd
import requests
import concurrent.futures
import json


def get_pokemon_card_data(card):
    return card


def get_all_pokemon_sets():
    print("Recupero tutti i set...")
    url = 'https://api.pokemontcg.io/v2/sets'
    headers = {'X-Api-Key': '316d792f-ad9e-40ca-80ea-1578dfa9146d'} 
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json().get('data', [])
        print(f"Recuperati {len(data)} set.")
        return data
    else:
        print(f"Errore nell'accesso all'API: {response.status_code}")
        return []


def get_all_pokemon_cards():
    all_cards = []
    url = 'https://api.pokemontcg.io/v2/cards'
    headers = {'X-Api-Key': '316d792f-ad9e-40ca-80ea-1578dfa9146d'} 
    params = {'pageSize': 250}  
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


all_cards_data = get_all_pokemon_cards()


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


df_cards = pd.DataFrame(processed_cards)


sets_data = get_all_pokemon_sets()


df_sets = pd.DataFrame(sets_data)


df_cards = df_cards.where(pd.notnull(df_cards), None)
df_sets = df_sets.where(pd.notnull(df_sets), None)


def df_to_json(df, file_path):
    records = df.to_dict(orient='records')
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=4)


cards_file_path = 'backend/carte_api.json'
sets_file_path = 'backend/sets_api.json'
print("Salvataggio dei file JSON...")
df_to_json(df_cards, cards_file_path)
df_to_json(df_sets, sets_file_path)

print("Nuovi file JSON salvati con successo:")
print(f"Carte: {cards_file_path}")
print(f"Set: {sets_file_path}")
