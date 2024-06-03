import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';

const Espansioni_page = () => {
  const [sets, setSets] = useState([]);

  useEffect(() => {
    fetch('https://api.pokemontcg.io/v2/sets')
      .then(response => response.json())
      .then(data => {
        const filteredSets = data.data.filter(set => new Date(set.releaseDate) <= new Date('2023-11-03'));
        setSets(filteredSets);
      });
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
                <div key={set.id} className="set-card">
                  <img src={set.images.logo} alt={set.name} />
                  <div className="set-info">
                    <h3>{set.name}</h3>
                    <p>Release Date: {set.releaseDate}</p>
                  </div>
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
