import React from 'react';

const ImagePreloader = ({ src }) => {
  return <img src={src} alt="" style={{ display: 'none' }} />;
};

export default ImagePreloader;
