// src/components/MagicButton.jsx

import React from 'react';
import triangle from '../assets/images/triangle.png';
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
    <div className={`container_4 ${disabled ? 'disabled' : ''}`} onClick={handleClick}>
      <a href="#" className="button_4">
        <div className="button__content_4">
          <span className="button__text_4">{buttonText}</span>

          <div className="button__reflection-1_4"></div>
          <div className="button__reflection-2_4"></div>
        </div>

        <img src={triangle} alt="" className="button__star-1" />
        <img src={triangle} alt="" className="button__star-2" />
        <img src={triangle} alt="" className="button__circle-1" />
        <img src={triangle} alt="" className="button__circle-2" />
        <img src={triangle} alt="" className="button__diamond" />
        <img src={triangle} alt="" className="button__triangle" />

        <div className="button__shadow_4"></div>
      </a>
    </div>
  );
};

export default MagicButton;
