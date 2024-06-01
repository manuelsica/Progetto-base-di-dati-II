import React from 'react';
import MagicButton from './MagicButton';

const InfoCards = () => {
  return (
    <div className="info_cards animeX" id="info_cards">
      <div className="contentBx">
        <h2>Esplora tutte le carte</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque accumsan odio in felis faucibus, ut consectetur tortor iaculis...</p>
        <div className="buttons_1">
          <MagicButton buttonText="Carte" navigateTo= ""/>
        </div>
      </div>
      <div className="imgBox">
        <main id="app">
          <div className="card"></div>
          <div className="card"></div>
          <div className="card"></div>
          <div className="card"></div>
          <style className="hover"></style>
        </main>
      </div>
    </div>
  );
};

export default InfoCards;
