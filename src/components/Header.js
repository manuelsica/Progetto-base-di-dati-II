import React, { useEffect, useState } from 'react';
import { Menu } from 'react-ionicons';
import logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/check-login');
        if (response.data.loggedIn) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/logout');
      setIsLoggedIn(false);
      window.location.reload(); // Reload the page to update header
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
        <Link to="/espansioni">Espansioni</Link>
        <Link to="/carte">Carte</Link>
        {isLoggedIn ? (
          <>
            <span>Ciao Allenatore!</span>
            <button onClick={handleLogout}>Logout</button>
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
