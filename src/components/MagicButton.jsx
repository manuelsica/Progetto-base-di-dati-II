// src/components/MagicButton.jsx

import React from 'react';
import '../assets/css/styles.css';
import star from '../assets/images/star.png';
import circle from '../assets/images/circle.png';
import diamond from '../assets/images/diamond.png';
import triangle from '../assets/images/triangle.png';

const MagicButton = ({ buttonText }) => {
    return (
        <div className="container">
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
