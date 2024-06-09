import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import MagicButton from '../components/MagicButton';
import { Helmet } from 'react-helmet';

axios.defaults.withCredentials = false;
const DeckDetails = () => {
    const { id } = useParams();
    const [cards, setCards] = useState([]);
    const [originalCards, setOriginalCards] = useState([]);
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
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:5000/decks/${id}/cards`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const cardIds = response.data.cards;

                const cardDetailsPromises = cardIds.map(cardId => 
                    axios.get(`http://127.0.0.1:5000/cards/${cardId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                );
                const cardDetailsResponses = await Promise.all(cardDetailsPromises);
                const fetchedCards = cardDetailsResponses.map(res => res.data.data);

                setCards(fetchedCards);
                setOriginalCards(fetchedCards);

                let totalValue = 0;
                fetchedCards.forEach(card => {
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
                const response = await axios.get('http://127.0.0.1:5000/db_sets');
                setSets(response.data.data);
            } catch (err) {
                console.error('Error fetching sets:', err.message);
            }
        };

        fetchSets();
    }, []);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                let filteredCards = originalCards;
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

        fetchCards();
    }, [selectedSet, selectedType, selectedSupertype, search, originalCards]);

    const getPrice = (card) => {
        const priceFields = ['normal', 'holofoil', 'reverseHolofoil', 'unlimited', '1stEditionHolofoil', 'unlimitedHolofoil'];
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
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:5000/decks/${id}/cards/${selectedCard._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCards(cards.filter(card => card._id !== selectedCard._id));
            setOriginalCards(originalCards.filter(card => card._id !== selectedCard._id));
            const price = getPrice(selectedCard);
            if (price && price !== 'N/A') {
                setTotalDeckValue(prevValue => prevValue - parseFloat(price));
            }
            setIsRemoveModalOpen(false);
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
        setCards(originalCards);
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
                            <div key={card._id} className="card">
                                <Link to={`/card-details/${card._id}`}>
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
