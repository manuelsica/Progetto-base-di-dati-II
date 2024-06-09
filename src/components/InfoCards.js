import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MagicButton from './MagicButton';

const InfoCards = () => {
  const [image, setImage] = useState('');

  useEffect(() => {
    const fetchCardImages = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/paradox-rift-pokemon-images');
        const images = response.data.data;
        if (images.length > 0) {
          const randomImage = images[Math.floor(Math.random() * images.length)];
          setImage(randomImage);
        }
      } catch (error) {
        console.error('Error fetching card images:', error);
      }
    };

    fetchCardImages();
  }, []);

  return (
    <div className="info_cards animeX" id="info_cards">
      <div className="contentBx">
        <h2>Gotta Catch 'Em All!</h2>
        <p>Choose your favourite Pokémon, choose your favourite Trainer and boom! Create your best Deck!</p>
        <div className="buttons_1">
          <MagicButton buttonText="Carte" navigateTo="/Carte" />
        </div>
      </div>
      <div className="imgBox">
        <main id="app">
          {image && <div className="card" style={{ backgroundImage: `url(${image})` }}></div>}
          {image && <div className="card" style={{ backgroundImage: `url(${image})` }}></div>}
          {image && <div className="card" style={{ backgroundImage: `url(${image})` }}></div>}
          {image && <div className="card" style={{ backgroundImage: `url(${image})` }}></div>}
          <style className="hover"></style>
        </main>
      </div>
    </div>
  );
};

export default InfoCards;
