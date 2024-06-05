import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import $ from 'jquery';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Espansioni from './components/Espansioni';
import InfoCards from './components/InfoCards';
import Background from './components/Background';
import Footer from './components/Footer';
import './assets/css/style.css';

const App = () => {
  useEffect(() => {
    const handleScroll = () => {
      const anime = document.querySelectorAll('.animeX');
      anime.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const animePoint = 150;

        if (elementTop < windowHeight - animePoint) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    const $cards = $(".card");
    const $style = $(".hover");

    $cards.on("mousemove", function (e) {
      const $card = $(this);
      const l = e.offsetX;
      const t = e.offsetY;
      const h = $card.height();
      const w = $card.width();
      const lp = Math.abs(Math.floor(100 / w * l) - 100);
      const tp = Math.abs(Math.floor(100 / h * t) - 100);
      const bg = `background-position: ${lp}% ${tp}%;`
      const style = `card.active::before { ${bg} }`
      $cards.removeClass("active");
      $card.addClass("active");
      $style.html(style);
    }).on("mouseout", function () {
      $cards.removeClass("active");
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
      <>
        <Helmet>
        <title>PokeDB - Home</title>
      </Helmet>
        <Background />
        <Header />
        <HomePage />
        <Espansioni />
        <section className="separator animeX"></section>
        <InfoCards />
        <div className="bg_separate">
          <Background />
        </div>
        <section className="separator animeX"></section>
        <Footer />
      </>
  );
};

export default App;
