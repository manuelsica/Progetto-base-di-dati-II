import React, { useState } from 'react';
import Header from '../components/Header';
import Background from '../components/Background';
import Footer from '../components/Footer';
import CardDetails from './CardDetails';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
const Carte = () => {
  const [filter, setFilter] = useState('all');
  const games = [
    { id: 1, type: '', name: '', price: 10, imgSrc: 'https://images.pokemontcg.io/xy2/12_hires.png' },
    { id: 2, type: '', name: '', price: 10, imgSrc: 'https://images.pokemontcg.io/xy2/13_hires.png' },
    { id: 3, type: '', name: '', price: 10, imgSrc: 'https://images.pokemontcg.io/xy2/14_hires.png' },
    { id: 4, type: '', name: '', price: 10, imgSrc: 'https://images.pokemontcg.io/xy2/15_hires.png' },
    { id: 5, type: '', name: '', price: 10, imgSrc: 'https://images.pokemontcg.io/xy2/16_hires.png' },
    { id: 6, type: '', name: '', price: 10, imgSrc: 'https://images.pokemontcg.io/xy2/17_hires.png' },
    { id: 7, type: '', name: '', price: 10, imgSrc: 'https://images.pokemontcg.io/xy2/18_hires.png' },
    { id: 8, type: '', name: '', price: 10, imgSrc: 'https://images.pokemontcg.io/xy2/19_hires.png' },
    { id: 9, type: '', name: '', price: 10, imgSrc: 'https://images.pokemontcg.io/xy2/20_hires.png' },
    { id: 10, type: '', name: '', price: 10, imgSrc: 'https://images.pokemontcg.io/xy2/21_hires.png' },
    { id: 11, type: '', name: '', price: 10, imgSrc: 'https://images.pokemontcg.io/xy2/22_hires.png' },
    { id: 12, type: '', name: '', price: 10, imgSrc: 'https://images.pokemontcg.io/xy2/23_hires.png' },
  ];

  const filteredGames = filter === 'all' ? games : games.filter(game => game.type === filter);

  return (

    <>
      <Helmet>
        <title>PokeDB - Carte</title>
      </Helmet>
      <Background />
      <Header />
      <div className="games" id="games">

        <ul>
          {/* <li className={`list ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</li>
            <li className={`list ${filter === 'pc' ? 'active' : ''}`} onClick={() => setFilter('pc')}>Pc Games</li>
            <li className={`list ${filter === 'console' ? 'active' : ''}`} onClick={() => setFilter('console')}>Console Games</li> */}
        </ul>
        <div className="cardBx">
          <h2>Carte</h2>
          {filteredGames.map(game => (
            <Link to={`/card-details/${game.id}`} key={game.id}> {/* Utilizza Link per reindirizzare */}
              <div className="card" data-item={game.type}>
                <img src={game.imgSrc} alt={game.name}/>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Carte;
