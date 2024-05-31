import React from 'react';
import { Menu } from 'react-ionicons';
import logo from '../assets/images/logo.png';

const Header = () => {
  const toggleMenu = () => {
    const nav = document.querySelector('header nav');
    const hamburger = document.getElementById('hamburger');
    nav.classList.toggle('open');
    hamburger.classList.toggle('opened');
  };

  return (
    <header>
      <a href="#" className="logo"><img src={logo} alt="MyLogo" /></a>
      <nav id="navbar">
        <a href="#">Home</a>
        <a href="#">Espansioni</a>
        <a href="#">Carte</a>
        <a href="#">Login</a>
      </nav>
      <div className="hamburger" id="hamburger" onClick={toggleMenu}>
        <Menu color={'#00000'} title={Menu} />
      </div>
    </header>
  );
};

export default Header;
