import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { Helmet } from 'react-helmet';
import Background from '../components/Background';
import Footer from '../components/Footer';
import grass from '../assets/images/grass.png';
import fire from '../assets/images/fire.png';
import water from '../assets/images/water.png';
import normal from '../assets/images/normal.png';
import darkness from '../assets/images/darkness.png';
import dragon from '../assets/images/dragon.png';
import fairy from '../assets/images/fairy.png';
import fighting from '../assets/images/fighting.png';
import lightning from '../assets/images/lightning.png';
import metal from '../assets/images/metal.png';
import psychic from '../assets/images/psychic.png';
import MagicButton from '../components/MagicButton';

axios.defaults.withCredentials = false;
const CardDetails = () => {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleDownloadJSON = () => {
    const json = JSON.stringify(card, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/cards/${id}`);
        setCard(response.data.data);
      } catch (err) {
        console.error('Error fetching card details:', err.message);
      }
    };

    const fetchDecks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setIsLoggedIn(true);
          const response = await axios.get('http://127.0.0.1:5000/decks', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setDecks(response.data);
        }
      } catch (error) {
        console.error('Error fetching decks:', error);
      }
    };

    fetchCardDetails();
    fetchDecks();
  }, [id]);

  const handleAddToDeck = async () => {
    try {
      if (selectedDeck) {
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://127.0.0.1:5000/decks/${selectedDeck}/cards`, { cardId: card.id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMessage(`Carta ${card.name} aggiunta al mazzo ${decks.find(deck => deck.id === parseInt(selectedDeck)).name}`);
        setErrorMessage('');
      } else {
        setErrorMessage('Seleziona un mazzo per aggiungere la carta.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error adding card to deck:', error);
      setErrorMessage(error.response?.data?.message || 'Errore durante l\'aggiunta della carta al mazzo.');
      setSuccessMessage('');
    }
  };

  const getPrice = () => {
    if (typeof card.price === 'number') {
      return card.price;
    }
    const priceFields = ['normal', 'holofoil', 'reverseHolofoil', 'unlimited', '1stEditionHolofoil', 'unlimitedHolofoil'];
    for (let field of priceFields) {
      const price = card.price?.[field];
      if (price !== null && price !== undefined) {
        return price;
      }
    }
    return 'N/A';
  };

  if (!card) {
    return <div>Loading...</div>;
  }

  const getImageSrc = (type) => {
    switch (type) {
      case 'Grass': return grass;
      case 'Fire': return fire;
      case 'Water': return water;
      case 'Darkness': return darkness;
      case 'Dragon': return dragon;
      case 'Fairy': return fairy;
      case 'Psychic': return psychic;
      case 'Fighting': return fighting;
      case 'Lightning': return lightning;
      case 'Metal': return metal;
      default: return normal;
    }
  };

  return (
    <>
      <Helmet>
        <title>PokeDB - {card.name}</title>
      </Helmet>
      <Background />
      <Header />
      <div id="wrapper">
        <div className="card_details">
          <div className="container">
            <div id="card-details" className="columns" data-controller="card">
              <div className="column is-one-third">
                <img
                  className="card-image"
                  src={card.image_url || ''}
                  alt={card.name}
                />
              </div>
              <div className="column is-6 is-offset-1">
                <div className="content card-details">
                  <nav className="card-details_head level">
                    <div className="level-left">
                      <div className="level-item">
                        <span className="title is-3">{card.name || ''}
                          {card.subtypes && (
                            <div className="title is-5 has-text-muted">
                              Pokémon - {card.subtypes}
                            </div>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="level-right">
                      <div className="level-item">
                        <span className="title is-5 is-flex is-align-items-center">
                          {card.hp && <span className="mr-2">HP {card.hp}</span>}
                          {card.types && (
                            <img
                              className="energy"
                              src={getImageSrc(card.types)}
                              alt="Energy"
                            />
                          )}
                        </span>
                      </div>
                    </div>
                  </nav>
                  <hr />
                  <section className="pt-0 mb-4">
                    <div className="is-flex is-align-items-center mb-4">
                      <div className="title is-4 has-text-muted mb-0 mr-2">
                        Prices: {getPrice()} euro
                      </div>
                    </div>
                  </section>
                  <hr className="mb-0" />
                  {card.abilities && (
                    <section>
                      <p className="heading">Abilities</p>
                      {Array.isArray(card.abilities) ? card.abilities.map((ability, index) => (
                        <div className="card-details_ability" key={index}>
                          <p className="title is-5">{ability.type}: {ability.name}</p>
                          <p>{ability.text}</p>
                        </div>
                      )) : <p>No abilities available.</p>}
                    </section>
                  )}
                  {card.attacks && (
                    <section>
                      <p className="heading">Attacks</p>
                      <table>
                        {typeof card.attacks === 'string' ? (
                          <tbody className="card-details_attack">
                            <tr>
                              <td className="attack-name">
                                <span className="title is-4">{card.attacks}</span>
                              </td>
                            </tr>
                          </tbody>
                        ) : <p>No attacks available.</p>}
                      </table>
                    </section>
                  )}
                  {card.rules && (
                    <section>
                      <div className="card-details_ability">
                        <p className="heading">Rules</p>
                        {typeof card.rules === 'string' ? (
                          card.rules.split(', ').map((rule, idx) => (
                            <p className="is-flex is-flex-direction-column" key={idx}>{rule}</p>
                          ))
                        ) : <p>No rules available.</p>}
                      </div>
                    </section>
                  )}
                  <section>
                    <div className="columns is-flex-wrap-wrap is-mobile">
                      {card.weaknesses && (
                        <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                          <div className="card-details_weakness">
                            <p className="heading">Weakness</p>
                            {typeof card.weaknesses === 'string' ? (
                              <p className="title is-5 is-flex is-align-items-center">
                                <img
                                  className="energy"
                                  src={getImageSrc(card.weaknesses)}
                                  alt="Weakness"
                                />
                                <span className="ml-1">{card.weaknesses}</span>
                              </p>
                            ) : <p>No weaknesses available.</p>}
                          </div>
                        </div>
                      )}
                      {card.resistances && (
                        <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                          <div className="card-details_resistance">
                            <p className="heading">Resistance</p>
                            {typeof card.resistances === 'string' ? (
                              <p className="title is-5 is-flex is-align-items-center">
                                <img
                                  className="energy"
                                  src={getImageSrc(card.resistances)}
                                  alt="Resistance"
                                />
                                <span className="ml-1">{card.resistances}</span>
                              </p>
                            ) : <p>No resistances available.</p>}
                          </div>
                        </div>
                      )}
                      {card.retreatCost && (
                        <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                          <div className="card-details_retreat">
                            <p className="heading">Retreat Cost</p>
                            {typeof card.retreatCost === 'string' ? card.retreatCost.split(', ').map((type, idx) => (
                              <img
                                key={idx}
                                className="energy"
                                src={getImageSrc(type)}
                                alt="Retreat Cost"
                              />
                            )) : <p>No retreat cost available.</p>}
                          </div>
                        </div>
                      )}
                      {card.artist && (
                        <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                          <div className="card-details_artist">
                            <p className="heading">Artist</p>
                            <p className="title is-5">{card.artist}</p>
                          </div>
                        </div>
                      )}
                      {card.rarity && (
                        <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                          <div className="card-details_rarity">
                            <p className="heading">Rarity</p>
                            <p className="title is-5">{card.rarity}</p>
                          </div>
                        </div>
                      )}
                      {card.set_name && (
                        <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                          <div className="card-details_set">
                            <p className="heading">Set</p>
                            <p className="title is-5">
                              <a
                                className="is-flex is-align-items-center"
                                href=""
                              >
                                {card.set_name}
                              </a>
                            </p>
                          </div>
                        </div>
                      )}
                      {card.nationalPokedexNumbers && (
                        <div className="column is-one-third-desktop is-one-third-tablet is-half-mobile">
                          <div className="card-details_number">
                            <p className="heading">National Pokédex Number</p>
                            <p className="title is-5">{card.nationalPokedexNumbers}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <button onClick={handleDownloadJSON}>Download JSON</button>
                  </section>
                  <section>
                    {isLoggedIn ? (
                      <div className="add-to-deck">
                        <div className="deck-select-wrapper">
                          <select className='deck-select' value={selectedDeck} onChange={(e) => setSelectedDeck(e.target.value)}>
                            <option value="">Seleziona un mazzo</option>
                            {decks.map(deck => (
                              <option key={deck._id} value={deck._id}>{deck.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className='button_deck'>
                          <MagicButton buttonText='Aggiungi al mazzo' onClick={handleAddToDeck} />
                        </div>
                        {successMessage && <p className="success-message">{successMessage}</p>}
                        {errorMessage && <p className="error-message"><small>{errorMessage}</small></p>}
                      </div>
                    ) : (
                      <div className="add-to-deck">
                        <MagicButton buttonText='Effettua login' onClick={() => navigate('/login')} />
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CardDetails;
