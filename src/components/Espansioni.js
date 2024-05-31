import React from 'react';
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
          <h2>Scopri le espansioni dal 1999-2023</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque accumsan odio in felis faucibus, ut consectetur tortor iaculis...</p>
          <div className="buttons_1">
            <B buttonText="Espansioni" />
          </div>
        </div>
      </div>
      <Background />
    </>
  );
};

export default Espansioni;
