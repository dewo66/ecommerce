// src/components/SliderBanner.js

import React from 'react';
import { Carousel } from 'antd';

const SliderBanner = () => {
  const sliderItems = [
    {
      id: 1,
      src: "/images/slider1.jpg",
      alt: "First slide"
    },
    {
      id: 2,
      src: "/images/slider2.jpg",
      alt: "Second slide"
    },
  ];

  return (
    <Carousel>
      {sliderItems.map(item => (
        <div key={item.id}>
          <img src={item.src} alt={item.alt} />
        </div>
      ))}
    </Carousel>
  );
};

export default SliderBanner;
