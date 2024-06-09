import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import GreenButton from '../components/GreenButton';
import MagicButton from '../components/MagicButton';
import axios from 'axios';


axios.defaults.withCredentials = false;
const Deck = () => {
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [currentDeckNameElement, setCurrentDeckNameElement] = useState(null);
    const [currentDeckToDelete, setCurrentDeckToDelete] = useState(null);
    const [decks, setDecks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:5000/decks', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDecks(response.data);
            } catch (error) {
                console.error('Error fetching decks:', error);
            }
        };
        fetchDecks();
    }, []);

    const addDeck = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://127.0.0.1:5000/decks', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDecks([...decks, response.data.deck]);
        } catch (error) {
            console.error('Error adding deck:', error);
        }
    };

    const renameDeck = (deckNameElement) => {
        console.log('renameDeck called with element:', deckNameElement);
        setCurrentDeckNameElement(deckNameElement);
        setNewDeckName(deckNameElement.innerText);
        setErrorMessage('');
        setIsRenameModalOpen(true);
    };

    const openDeleteModal = (deckId) => {
        setCurrentDeckToDelete(deckId);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsRenameModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const confirmRename = async () => {
        const trimmedNewDeckName = newDeckName.trim();
        const words = trimmedNewDeckName.split(/\s+/);

        const isWordTooLong = words.some(word => word.length > 10);

        if (trimmedNewDeckName === currentDeckNameElement.innerText) {
            setErrorMessage('Same name');
        } else if (trimmedNewDeckName === '') {
            setErrorMessage('Name cannot be empty');
        } else if (isWordTooLong) {
            setErrorMessage('Every word must be 10 characters long');
        } else {
            try {
                const deckId = currentDeckNameElement.closest('.deck-card').dataset.id;
                const token = localStorage.getItem('token');
                await axios.put(`http://127.0.0.1:5000/decks/${deckId}`, { name: trimmedNewDeckName }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDecks(decks.map(deck => deck.id === parseInt(deckId) ? { ...deck, name: trimmedNewDeckName } : deck));
                closeModal();
            } catch (error) {
                console.error('Error renaming deck:', error);
            }
        }
    };

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:5000/decks/${currentDeckToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDecks(decks.filter(deck => deck.id !== currentDeckToDelete));
            closeModal();
        } catch (error) {
            console.error('Error deleting deck:', error);
        }
    };

    const handleClickOutside = (event) => {
        if (event.target.id === 'renameModal' || event.target.id === 'deleteModal') {
            closeModal();
        }
    };

    return (
        <>
            <Helmet>
                <title>User Decks</title>
            </Helmet>
            <Background />
            <Header />
            <div className={`App ${isRenameModalOpen || isDeleteModalOpen ? 'modal-open' : ''}`}>
                <div className="container_deck">
                    <h1>User Decks</h1>
                    <div className="deck-container">
                        {decks.map(deck => (
                            <div className="deck-card" key={deck.id} data-id={deck.id}>
                                <h2 className="deck-name">{deck.name}</h2>
                                <div className="button-container">
                                    <GreenButton buttonText="Rename Deck" onClick={(e) => renameDeck(e.target.closest('.deck-card').querySelector('.deck-name'))} />
                                    <MagicButton buttonText="Edit Deck" onClick={() => navigate(`/deck-details/${deck.id}`)} />
                                    <div className='remove-button'>
                                        <MagicButton buttonText="Remove Deck" onClick={() => openDeleteModal(deck.id)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <GreenButton buttonText="Add New Deck" onClick={addDeck} />
                </div>

                {isRenameModalOpen && (
                    <div className="overlay"></div>
                )}

                {isRenameModalOpen && (
                    <div id="renameModal" className="modal" onClick={handleClickOutside} style={{ display: 'flex' }}>
                        <div className="modal-content">
                            <span className="close-button" onClick={closeModal}>&times;</span>
                            <h2>Rename Deck</h2>
                            <input
                                type="text"
                                className='change-name-deck'
                                value={newDeckName}
                                onChange={(e) => setNewDeckName(e.target.value)}
                                placeholder="Enter the new name of the deck"
                            />
                            <GreenButton buttonText="Confirm" onClick={confirmRename} />
                            <p className="error-message">{errorMessage}</p>
                        </div>
                    </div>
                )}

                {isDeleteModalOpen && (
                    <div className="overlay"></div>
                )}

                {isDeleteModalOpen && (
                    <div id="deleteModal" className="modal" onClick={handleClickOutside} style={{ display: 'flex' }}>
                        <div className="modal-content">
                            <span className="close-button" onClick={closeModal}>&times;</span>
                            <h2>Confirm Removal</h2>
                            <p>Are you sure you want to delete this deck?</p>
                            <MagicButton buttonText="Confirm" onClick={confirmDelete} />
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Deck;
