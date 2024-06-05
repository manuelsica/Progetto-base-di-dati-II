import React from 'react';
import { Menu } from 'react-ionicons';
import logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom' 
const Header = () => {
  const toggleMenu = () => {
    const nav = document.querySelector('header nav');
    const hamburger = document.getElementById('hamburger');
    nav.classList.toggle('open');
    hamburger.classList.toggle('opened');
  };

  return (
    <header>
      <Link to = "/"><a href="" className="logo"><img src={logo} alt="MyLogo" /></a></Link>
      <nav id="navbar">
        <Link to = "/">Home</Link>
        <Link to = "/espansioni">Espansioni</Link>
        <Link to = "/carte">Carte</Link>
        <Link to = "/Deck">Deck</Link>
        <Link to = "/login">Login</Link>
      </nav>
      <div className="hamburger" id="hamburger" onClick={toggleMenu}>
        <Menu color={'#00000'} title={Menu} />
      </div>
    </header>
  );
};

export default Header;
