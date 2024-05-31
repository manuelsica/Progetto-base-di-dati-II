import React from 'react';

const Footer = () => {
  return (
    <footer>
        <div className="waves">
          <div className="wave" id="wave1"></div>
          <div className="wave" id="wave2"></div>
          <div className="wave" id="wave3"></div>
        </div>
        <ul class="menu">
          <li><a href="">Home</a></li>
          <li><a href="">Espansioni</a></li>
          <li><a href="">Carte</a></li>
        </ul>
        <p className="rights">©2024 PokeDB | All Rights Reserved</p>
      </footer>
  );
};

export default Footer;
