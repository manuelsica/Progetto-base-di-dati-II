import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://127.0.0.1:5000/status', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        console.log("Status check response:", response.data);  // Debug print
        setLoggedIn(response.data.logged_in);
      })
      .catch(error => {
        console.error('There was an error checking the login status!', error);
        setLoggedIn(false);
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    console.log("User logged out");  // Debug print
  };

  return (
    <footer>
      <div className="waves">
        <div className="wave" id="wave1"></div>
        <div className="wave" id="wave2"></div>
        <div className="wave" id="wave3"></div>
      </div>
      <ul className="menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/espansioni">Espansioni</Link></li>
        <li><Link to="/carte">Carte</Link></li>
        {loggedIn && <li><Link to="/deck">Deck</Link></li>}
        <li><Link to="/login" onClick={loggedIn ? handleLogout : null}>{loggedIn ? 'Logout' : 'Login'}</Link></li>
      </ul>
      <p className="rights">©2024 PokeDB | All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
