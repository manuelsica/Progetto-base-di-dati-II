import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import PlaceHolder from '../assets/images/background.webp';
import ImagePreloader from './ImagePreloader';
import MagicButton from '../components/MagicButton';

axios.defaults.withCredentials = false;
const Espansioni_Carte = () => {
    const { setId } = useParams();
    const [cards, setCards] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [showPageInput, setShowPageInput] = useState(false);
    const [inputPage, setInputPage] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedSupertype, setSelectedSupertype] = useState('');
    const [setName, setSetName] = useState('');

    useEffect(() => {
        const fetchSetName = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/db_sets/${setId}`);
                setSetName(response.data.data.name);
            } catch (err) {
                console.error('Error fetching set name:', err.message);
            }
        };

        fetchSetName();
    }, [setId]);

    useEffect(() => {
        const fetchTotalPages = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/db_sets/${setId}/cards`, {
                    params: {
                        pageSize: 30,
                        search: search,
                        type: selectedType,
                        supertype: selectedSupertype
                    }
                });
                const totalCards = response.data.totalCount;
                setTotalPages(Math.ceil(totalCards / 30));
            } catch (err) {
                console.error('Error fetching total pages:', err.message);
            }
        };

        fetchTotalPages();
    }, [setId, search, selectedType, selectedSupertype]);

    useEffect(() => {
        const fetchCards = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://127.0.0.1:5000/db_sets/${setId}/cards`, {
                    params: {
                        pageSize: 30,
                        page: page,
                        search: search,
                        type: selectedType,
                        supertype: selectedSupertype
                    }
                });

                setCards(response.data.data);

                // Adjust total pages if there are no cards on the current page
                if (response.data.data.length === 0 && page > 1) {
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
    }, [page, search, setId, selectedType, selectedSupertype]);

    const handlePageChange = (pageNum) => {
        setPage(pageNum);
        setShowPageInput(false);
    };

    const handleSearchChange = (event) => {
        const searchTerm = event.target.value;
        setSearch(searchTerm);
        setPage(1); // Reset to the first page
    };

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    const handleSupertypeChange = (event) => {
        setSelectedSupertype(event.target.value);
    };

    const resetFilters = () => {
        setSelectedType('');
        setSelectedSupertype('');
        setSearch('');
    };

    return (
        <>
            <Helmet>
                <title>{`PokeDB - Carte dell'espansione ${setName}`}</title>
            </Helmet>
            <Background />
            <Header />
            <div className="App">
                <h1>Pokemon Cards - {setName}</h1>
                <div className="search-container">
                    <input
                        type="text"
                        className='search-bar'
                        placeholder="Search by name..."
                        value={search}
                        onChange={handleSearchChange}
                        style={{ marginRight: '10px' }}
                    />
                    <div className="filters">
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
                            <Link to={`/card-details/${card._id}`} key={card._id}>
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

export default Espansioni_Carte;
