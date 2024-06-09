import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Espansioni_page = () => {
  const [sets, setSets] = useState([]);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/db_sets');
        setSets(response.data.data);
      } catch (error) {
        console.error('Error fetching sets:', error);
      }
    };

    fetchSets();
  }, []);

  const groupedSets = sets.reduce((acc, set) => {
    if (!acc[set.series]) {
      acc[set.series] = [];
    }
    acc[set.series].push(set);
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>PokeDB - Espansioni</title>
      </Helmet>
      <Header />
      <div className='container_expansion'>
        {Object.keys(groupedSets).map(series => (
          <div key={series} className="series-group">
            <h2>{series}</h2>
            <div className="sets-grid">
              {groupedSets[series].map(set => (
                <div className="set-card" key={set.id}>
                  <Link to={`/expansion-cards/${set.id}`}>
                    <img src={set.images.logo} alt={set.name} />
                    <div className="set-info">
                      <h3>{set.name}</h3>
                      <p>Release Date: {set.releaseDate}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default Espansioni_page;
