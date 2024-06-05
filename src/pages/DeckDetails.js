import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import MagicButton from '../components/MagicButton';
import { Helmet } from 'react-helmet';

const DeckDetails = () => {
    const { id } = useParams();
    const [cards, setCards] = useState([]);
    const [originalCards, setOriginalCards] = useState([]); // Stato per le carte originali
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [totalDeckValue, setTotalDeckValue] = useState(0);
    const [search, setSearch] = useState('');
    const [sets, setSets] = useState([]);
    const [selectedSet, setSelectedSet] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedSupertype, setSelectedSupertype] = useState('');

    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const response = await axios.get(`https://api.pokemontcg.io/v2/cards?name=pikachu&page=1&pageSize=100`);
                const exampleCards = response.data.data;

                const sortedCards = exampleCards.filter(card => {
                    const price = getPrice(card);

                    return !isNaN(price) && price !== 0;
                }).sort((a, b) => {
                    const priceA = getPrice(a);
                    const priceB = getPrice(b);

                    return priceB - priceA;
                });

                const selectedCards = sortedCards.slice(0, 60);

                setCards(selectedCards);
                setOriginalCards(selectedCards); // Salva le carte originali nello stato separato

                // Calcola il valore totale del mazzo una volta sola
                let totalValue = 0;
                selectedCards.forEach(card => {
                    const price = getPrice(card);
                    if (price && price !== 'N/A') {
                        totalValue += parseFloat(price);
                    }
                });
                setTotalDeckValue(totalValue);
            } catch (error) {
                console.error('Error fetching deck details:', error);
            }
        };

        fetchDeck();
    }, [id]);

    useEffect(() => {
        const fetchSets = async () => {
            try {
                const response = await axios.get('https://api.pokemontcg.io/v2/sets', {
                    headers: {
                        'X-Api-Key': 'dcd81c77-600b-4649-ae91-8a317c4cd62e'
                    }
                });
                setSets(response.data.data);
            } catch (err) {
                console.error('Error fetching sets:', err.message);
            }
        };

        fetchSets();
    }, []);

    useEffect(() => {
        const fetchFilteredCards = async () => {
            try {
                // Filtriamo solo le carte presenti nella pagina corrente
                let filteredCards = originalCards; // Usa le carte originali come base
                if (search) {
                    filteredCards = originalCards.filter(card => card.name.toLowerCase().includes(search.toLowerCase()));
                }
                if (selectedSet) {
                    filteredCards = filteredCards.filter(card => card.set.id === selectedSet);
                }
                if (selectedType) {
                    filteredCards = filteredCards.filter(card => card.types.includes(selectedType));
                }
                if (selectedSupertype) {
                    filteredCards = filteredCards.filter(card => card.supertype === selectedSupertype);
                }

                setCards(filteredCards);
            } catch (err) {
                console.error('Error fetching filtered cards:', err.message);
            }
        };

        fetchFilteredCards();
    }, [selectedSet, selectedType, selectedSupertype, search, originalCards]);

    const getPrice = (card) => {
        const priceFields = ['normal', 'holofoil', 'reverseHolofoil', 'unlimited'];
        for (let field of priceFields) {
            const price = parseFloat(card.tcgplayer?.prices?.[field]?.mid || card.tcgplayer?.prices?.[field]?.high || 0);
            if (!isNaN(price) && price !== 0) {
                return price;
            }
        }
        return 'N/A';
    };

    const openRemoveModal = (card) => {
        setSelectedCard(card);
        setIsRemoveModalOpen(true);
    };

    const closeModal = () => {
        setIsRemoveModalOpen(false);
    };

    const removeCardFromDeck = async () => {
        try {
            await axios.delete(`URL_DA_DEFINIRE`);
            // Ripristina le carte originali
            setCards(originalCards);
            closeModal();
        } catch (error) {
            console.error('Error removing card from deck:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSetChange = (event) => {
        setSelectedSet(event.target.value);
    };

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    const handleSupertypeChange = (event) => {
        setSelectedSupertype(event.target.value);
    };

    const resetFilters = () => {
        setSelectedSet('');
        setSelectedType('');
        setSelectedSupertype('');
        setSearch('');
        setCards(originalCards); // Resetta le carte visualizzate alle carte originali
    };

    return (
        <>
            <Helmet>
                <title>Deck Details</title>
            </Helmet>
            <Background />
            <Header />
            <div className="App">
                <h1>Deck Details</h1>
                <h2>Total Deck Value: {totalDeckValue.toFixed(2)} euro</h2>
                <div className="search-container">
                    <input
                        type="text"
                        className='search-bar'
                        placeholder="Search by name..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="filters">
                    <select className="select_filter" value={selectedSet} onChange={handleSetChange}>
                        <option value="">All Sets</option>
                        {sets.map(set => (
                            <option key={set.id} value={set.id}>{set.name}</option>
                        ))}
                    </select>
                    <select className="select_filter" value={selectedType} onChange={handleTypeChange}>
                        <option value="">All Types</option>
                        <option value="Grass">Grass</option>
                        <option value="Fire">Fire</option>
                        <option value="Water">Water</option>
                        <option value="Lightning">Lightning</option>
                        <option value="Psychic">Psychic</option>
                        <option value="Fighting">Fighting</option>
                        <option value="Darkness">Darkness</option>
                        <option value="Metal">Metal</option>
                        <option value="Fairy">Fairy</option>
                        <option value="Colorless">Colorless</option>
                        <option value="Dragon">Dragon</option>
                    </select>
                    <select className="select_filter" value={selectedSupertype} onChange={handleSupertypeChange}>
                        <option value="">All Supertypes</option>
                        <option value="Pokémon">Pokémon</option>
                        <option value="Trainer">Trainer</option>
                        <option value="Energy">Energy</option>
                    </select>
                    <div className='reset-button'>
                        <MagicButton buttonText="Reset Filters" onClick={resetFilters} />
                    </div>
                </div>
                <div className="cards-grid">
                    {cards.length > 0 ? (
                        cards.map(card => (
                            <div key={card.id} className="card">
                                <Link to={`/card-details/${card.id}`}>
                                    <img src={card.images.large} alt={card.name} />
                                </Link>
                                <MagicButton buttonText="-" onClick={() => openRemoveModal(card)} />
                            </div>
                        ))
                    ) : (
                        <p className="no-cards-message">No cards</p>
                    )}
                </div>

                {isRemoveModalOpen && (
                    <div className="overlay"></div>
                )}

                {isRemoveModalOpen && (
                    <div className="modal" onClick={(e) => e.target.className === 'modal' && closeModal()}>
                        <div className="modal-content">
                            <span className="close-button" onClick={closeModal}>&times;</span>
                            <h2>Do you want to remove this card from your deck?</h2>
                            <div className="button_confirm">
                                <MagicButton buttonText="Confirm" onClick={removeCardFromDeck} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default DeckDetails;
