import React, { useEffect, useState, useContext } from 'react';
import { Menu } from 'react-ionicons';
import logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom';
import axios from 'axios'


const Header = () => {
  const [loginMessage, setLoginMessage] = useState('');


  useEffect(() => {
    fetch('http://127.0.0.1:5000/status', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        setLoginMessage(data.logged_in);
      })
      .catch(error => {
        console.error('There was an error checking the login status!', error);
      });
  }, []);
  
    const handleLogout = () => {
      axios.post('http://127.0.0.1:5000/logout', {}, { withCredentials: true })
        .then(() => {
          setLoginMessage(false);
        })
        .catch(error => {
          console.error('There was an error logging out!', error);
        });
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
        {loginMessage ? (
          <>
            <span>Ciao Allenatore!</span>
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