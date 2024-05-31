import React from 'react';
import YellowButton from './YellowButton';

const HomePage = () => {
  return (
    <section className="homepage animeX">
      <div className="content">
        <h2><span>Inizia</span> la tua avventura</h2>
        <p>
          Esplora tutte le collezioni pokemon e tutte le sue carte! Componi il tuo mazzo
        </p>
        <div className="buttons">
          <YellowButton buttonText="Espansioni" />
          <YellowButton buttonText="Carte" />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
