import React from 'react';
import { Link } from 'react-router-dom';
import YellowButton from './YellowButton';

const HomePage = () => {
  return (
    <section className="homepage animeX">
      <div className="content">
        <h2><span>Welcome</span> to the world of Pokémon!</h2>
        <p>
          Explore all kinds of Pokémon cards and build your own deck!
        </p>
        <div className="buttons">
          <Link to="/Espansioni" className="link">
            <YellowButton buttonText="Expansions" />
          </Link>
          <Link to="/Carte" className="link">
            <YellowButton buttonText="Cards" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
