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

const Carte = () => {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showPageInput, setShowPageInput] = useState(false);
  const [inputPage, setInputPage] = useState('');

  useEffect(() => {
    const fetchTotalPages = async () => {
      try {
        const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
          params: {
            pageSize: 30,
            q: search ? `name:${search}*` : undefined // Search query
          },
          headers: {
            'X-Api-Key': 'dcd81c77-600b-4649-ae91-8a317c4cd62e'
          }
        });
        const totalCards = response.data.totalCount;
        setTotalPages(Math.ceil(totalCards / 30));
      } catch (err) {
        console.error('Error fetching total pages:', err.message);
      }
    };

    fetchTotalPages();
  }, [search]);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
          params: {
            pageSize: 30,
            page: page,
            q: search ? `name:${search}*` : undefined // Search query
          },
          headers: {
            'X-Api-Key': 'dcd81c77-600b-4649-ae91-8a317c4cd62e'
          }
        });

        const filteredCards = response.data.data.filter(card => new Date(card.set.releaseDate) <= new Date('2023-03-11'));

        setCards(filteredCards);

        // Adjust total pages if there are no cards on the current page
        if (filteredCards.length === 0 && page > 1) {
          setPage(page - 1);
        }
      } catch (err) {
        console.error('Error fetching cards:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [page, search]);

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
    setShowPageInput(false);
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);
    setPage(1); // Reset to the first page
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
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
        />
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
              disabled={page >= totalPages || cards.length < 30}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Carte;