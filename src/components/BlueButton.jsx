// src/components/MagicButton.jsx

import React from 'react';
import '../assets/css/blue.css';
import circle from '../assets/images/circle.png';

const MagicButton = ({ buttonText }) => {
    return (
        <div className="container_1">
            <a href="#" className="button_1">
                <div className="button__content_1">
                    <span className="button__text_1">{buttonText}</span>

                    <div className="button__reflection-1_1"></div>
                    <div className="button__reflection-2_1"></div>
                </div>

                <img src={circle} alt="" className="button__star-1" />
                <img src={circle} alt="" className="button__star-2" />
                <img src={circle} alt="" className="button__circle-1" />
                <img src={circle} alt="" className="button__circle-2" />
                <img src={circle} alt="" className="button__diamond" />
                <img src={circle} alt="" className="button__triangle" />

                <div className="button__shadow_1"></div>
            </a>
        </div>
    );
};

export default MagicButton;
