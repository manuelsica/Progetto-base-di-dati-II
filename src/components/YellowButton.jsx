// src/components/MagicButton.jsx

import React from 'react';
import star from '../assets/images/star.png';
import diamond from '../assets/images/diamond.png';
import { useNavigate  } from 'react-router-dom';


const MagicButton = ({ buttonText, navigateTo, onClick }) => {
    let navigate = useNavigate();
    const handleClick = () => {
      if (onClick) {
        onClick();
      }
      if (navigateTo) {
        navigate(navigateTo);
      }
    };
    return (
        <div className="container_2" onClick = {handleClick}>
            <a href="#" className="button_2">
                <div className="button__content_2">
                    <span className="button__text_2">{buttonText}</span>

                    <div className="button__reflection-1_2"></div>
                    <div className="button__reflection-2_2"></div>
                </div>

                <img src={diamond} alt="" className="button__star-1" />
                <img src={diamond} alt="" className="button__star-2" />
                <img src={star} alt="" className="button__circle-1" />
                <img src={star} alt="" className="button__circle-2" />
                <img src={diamond} alt="" className="button__diamond" />
                <img src={diamond} alt="" className="button__triangle" />

                <div className="button__shadow_2"></div>
            </a>
        </div>
    );
};

export default MagicButton;
