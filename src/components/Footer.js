import React from 'react';
import { Link } from 'react-router-dom' 
const Footer = () => {
  return (
    <footer>
        <div className="waves">
          <div className="wave" id="wave1"></div>
          <div className="wave" id="wave2"></div>
          <div className="wave" id="wave3"></div>
        </div>
        <ul class="menu">
        <li><Link to = "/">Home</Link></li>
        <li><Link to = "/espansioni">Espansioni</Link></li>
        <li><Link to = "/carte">Carte</Link></li>
        <li><Link to = "/login">Login</Link></li>
        </ul>
        <p className="rights">©2024 PokeDB | All Rights Reserved</p>
      </footer>
  );
};

export default Footer;
