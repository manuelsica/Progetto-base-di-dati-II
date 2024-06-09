import React from 'react';
import { Link } from 'react-router-dom'; // Importa il componente Link
import B from './BlueButton';
import espansione_violetto from '../assets/images/espansione_scarlatto.png';
import Background from './Background';

const Espansioni = () => {
  return (
    <>
      <div className="about animeX" id="espansioni">
        <div className="imgBox">
          <img src={espansione_violetto} alt="Espansione Violetto" />
        </div>
        <div className="contentBx">
          <h2>Explore all sets since 1999</h2>
          <p>Lets go back in time and see how much Pokémon cards evolved through it!</p>
          <div className="buttons_1">
            {/* Utilizza il componente Link per creare il link alla pagina Espansioni_page */}
            <Link to="/Espansioni" className="link">
              <B buttonText="Expansions"/>
            </Link>
          </div>
        </div>
      </div>
      <Background />
    </>
  );
};

export default Espansioni;
