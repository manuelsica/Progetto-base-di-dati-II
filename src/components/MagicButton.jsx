// src/components/MagicButton.jsx

import React from 'react';
import star from '../assets/images/star.png';
import { useNavigate } from 'react-router-dom';

const MagicButton = ({ buttonText, navigateTo, onClick, disabled }) => {
  let navigate = useNavigate();
  const handleClick = (e) => {
    if (disabled) return; // Prevent action if disabled
    if (onClick) {
      onClick(e);
    }
    if (navigateTo) {
      navigate(navigateTo);
    }
  };
  return (
    <div className={`container_3 ${disabled ? 'disabled' : ''}`} onClick={handleClick}>
      <a href="#" className="button">
        <div className="button__content">
          <span className="button__text">{buttonText}</span>

          <div className="button__reflection-1"></div>
          <div className="button__reflection-2"></div>
        </div>

        <img src={star} alt="" className="button__star-1" />
        <img src={star} alt="" className="button__star-2" />
        <img src={star} alt="" className="button__circle-1" />
        <img src={star} alt="" className="button__circle-2" />
        <img src={star} alt="" className="button__diamond" />
        <img src={star} alt="" className="button__triangle" />

        <div className="button__shadow"></div>
      </a>
    </div>
  );
};

export default MagicButton;
