import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import PlaceHolder from '../assets/images/background.webp';
import ImagePreloader from './ImagePreloader';
import MagicButton from '../components/MagicButton';

axios.defaults.withCredentials = false;

const Carte = () => {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSupertype, setSelectedSupertype] = useState('');

  useEffect(() => {
    // Fetch all sets for the dropdown
    const fetchSets = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/sets');
        console.log('Sets response:', response);  // Debug log
        setSets(response.data.data);
      } catch (err) {
        console.error('Error fetching sets:', err.message);
        setError('Error fetching sets');
      }
    };

    fetchSets();
  }, []);

  useEffect(() => {
    const fetchTotalPages = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/cards', {
          params: {
            pageSize: 30,
            search,
            set: selectedSet,
            type: selectedType,
            supertype: selectedSupertype
          }
        });
        console.log('Total pages response:', response);  // Debug log
        const totalCards = response.data.totalCount;
        setTotalPages(Math.ceil(totalCards / 30));
      } catch (err) {
        console.error('Error fetching total pages:', err.message);
        setError('Error fetching total pages');
      }
    };

    fetchTotalPages();
  }, [search, selectedSet, selectedType, selectedSupertype]);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://127.0.0.1:5000/cards', {
          params: {
            pageSize: 30,
            page,
            search,
            set: selectedSet,
            type: selectedType,
            supertype: selectedSupertype
          }
        });
        console.log('Cards response:', response);  // Debug log

        const cards = response.data.data;
        const cardDetailsPromises = cards.map(async (card) => {
          const apiResponse = await axios.get(`https://api.pokemontcg.io/v2/cards/${card.id}`, {
            headers: {
              'X-Api-Key': '316d792f-ad9e-40ca-80ea-1578dfa9146d'
            }
          });
          return {
            ...card,
            images: apiResponse.data.data.images,
            prices: apiResponse.data.data.cardmarket ? apiResponse.data.data.cardmarket.prices : {}
          };
        });

        const detailedCards = await Promise.all(cardDetailsPromises);
        setCards(detailedCards);

        if (detailedCards.length === 0 && page > 1) {
          setPage(page - 1);
        }
      } catch (err) {
        console.error('Error fetching cards:', err.message);
        setError('Error fetching cards');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [page, search, selectedSet, selectedType, selectedSupertype]);

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);
    setPage(1); // Reset to the first page
  };

  const handleSetChange = (event) => {
    setSelectedSet(event.target.value);
    setPage(1); // Reset to the first page
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setPage(1); // Reset to the first page
  };

  const handleSupertypeChange = (event) => {
    setSelectedSupertype(event.target.value);
    setPage(1); // Reset to the first page
  };

  const resetFilters = () => {
    setSelectedSet('');
    setSelectedType('');
    setSelectedSupertype('');
    setSearch('');
    setPage(1);
  };

  return (
    <>
      <Helmet>
        <title>PokeDB - Carte</title>
      </Helmet>
      <Background />
      <Header />
      <div className="App">
        <h1>Pokemon Cards</h1>
        <div className="search-container">
          <input
            type="text"
            className='search-bar'
            placeholder="Search by name..."
            value={search}
            onChange={handleSearchChange}
          />
          <div className="filters">
            <select className="select_filter" value={selectedSet} onChange={handleSetChange}>
              <option value="">All Sets</option>
              {sets.map(set => (
                <option key={set} value={set}>{set}</option>
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
        </div>
        <div className="cards-grid">
          {loading ? (
            <p>Loading...</p>
          ) : cards.length > 0 ? (
            cards.map(card => (
              <Link to={`/card-details/${card.id}`} key={card.id}>
                <div className="card">
                  <LazyLoadImage
                    src={card.images.large}
                    alt={card.name}
                    effect="blur"
                    placeholderSrc={PlaceHolder}
                  />
                  <ImagePreloader src={card.images.large} />
                </div>
              </Link>
            ))
          ) : (
            <p>No cards found.</p>
          )}
        </div>
        {!loading && (
          <div className="pagination-buttons">
            <MagicButton 
              buttonText="Previous"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            />
            <MagicButton 
              buttonText="Next"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || cards.length < 30}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Carte;
