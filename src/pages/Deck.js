import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import GreenButton from '../components/GreenButton';
import MagicButton from '../components/MagicButton';

const Deck = () => {
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [currentDeckNameElement, setCurrentDeckNameElement] = useState(null);
    const navigate = useNavigate();

    const decks = [
        { id: 1, name: 'Deck 1' },
        { id: 2, name: 'Deck 2' },
    ];

    const renameDeck = (deckNameElement) => {
        console.log('renameDeck called with element:', deckNameElement);
        setCurrentDeckNameElement(deckNameElement);
        setNewDeckName(deckNameElement.innerText);
        setErrorMessage('');
        setIsRenameModalOpen(true);
    };

    const closeModal = () => {
        setIsRenameModalOpen(false);
    };

    const confirmRename = () => {
        const trimmedNewDeckName = newDeckName.trim();
        const words = trimmedNewDeckName.split(/\s+/);

        const isWordTooLong = words.some(word => word.length > 10);

        if (trimmedNewDeckName === currentDeckNameElement.innerText) {
            setErrorMessage('Nome identico');
        } else if (trimmedNewDeckName === '') {
            setErrorMessage('Il nome non può essere vuoto');
        } else if (isWordTooLong) {
            setErrorMessage('Ogni parola deve essere lunga massimo 10 caratteri');
        } else {
            currentDeckNameElement.innerText = trimmedNewDeckName;
            closeModal();
        }
    };

    const handleClickOutside = (event) => {
        if (event.target.id === 'renameModal') {
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
            <div className={`App ${isRenameModalOpen ? 'modal-open' : ''}`}>
                <div className="container_deck">
                    <h1>User Decks</h1>
                    <div className="deck-container">
                        {decks.map(deck => (
                            <div className="deck-card" key={deck.id}>
                                <h2 className="deck-name">{deck.name}</h2>
                                <div className="button-container">
                                    <GreenButton buttonText="Rinomina mazzo" onClick={(e) => renameDeck(e.target.closest('.deck-card').querySelector('.deck-name'))} />
                                    <MagicButton buttonText="Modifica mazzo" onClick={() => navigate(`/deck-details/${deck.id}`)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {isRenameModalOpen && (
                    <div className="overlay"></div>
                )}

                {isRenameModalOpen && (
                    <div id="renameModal" className="modal" onClick={handleClickOutside} style={{ display: 'flex' }}>
                        <div className="modal-content">
                            <span className="close-button" onClick={closeModal}>&times;</span>
                            <h2>Rinomina Mazzo</h2>
                            <input
                                type="text"
                                className='change-name-deck'
                                value={newDeckName}
                                onChange={(e) => setNewDeckName(e.target.value)}
                                placeholder="Inserisci il nuovo nome del mazzo"
                            />
                            <GreenButton buttonText="Conferma" onClick={confirmRename} />
                            <p className="error-message">{errorMessage}</p>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Deck;
