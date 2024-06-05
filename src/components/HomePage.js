import React from 'react';
import { Link } from 'react-router-dom'; // Importa il componente Link
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
          {/* Utilizza il componente Link per creare il link alle pagine Espansioni_page e Cards_page */}
          <Link to="/Espansioni" className="link">
            <YellowButton buttonText="Espansioni" />
          </Link>
          <Link to="/Carte" className="link">
            <YellowButton buttonText="Carte" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
