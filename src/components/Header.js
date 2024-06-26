import React, { useEffect, useState } from 'react';
import { Menu } from 'react-ionicons';
import logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://127.0.0.1:5000/status', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        console.log("Status check response:", response.data);  
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
    console.log("User logged out");  
  };

  const toggleMenu = () => {
    const nav = document.querySelector('header nav');
    const hamburger = document.getElementById('hamburger');
    nav.classList.toggle('open');
    hamburger.classList.toggle('opened');
  };

  return (
    <header>
       <Link to="/"><a href="/" className="logo"><img src={logo} alt="MyLogo" /></a></Link>
      <nav id="navbar">
        <Link to="/">Home</Link>
        <Link to="/espansioni">Expansions</Link>
        <Link to="/carte">Cards</Link>
        {loggedIn ? (
          <>
            <Link to="/deck">Deck</Link>
            <Link to="/" onClick={handleLogout}>Logout</Link>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      <div className="hamburger" id="hamburger" onClick={toggleMenu}>
        <Menu color={'#00000'} title={Menu} />
      </div>
    </header>
  );
};

export default Header;
