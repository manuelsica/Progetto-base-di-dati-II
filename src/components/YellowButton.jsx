// src/components/MagicButton.jsx

import React from 'react';
import '../assets/css/yellow.css';
import star from '../assets/images/star.png';
import circle from '../assets/images/circle.png';
import diamond from '../assets/images/diamond.png';
import triangle from '../assets/images/triangle.png';

const MagicButton = ({ buttonText }) => {
    return (
        <div className="container_2">
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
