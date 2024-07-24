import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel } from 'antd';

const CampaignSlider = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchCampaignSlider = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/campaign-slider');
        setSlides(response.data); 
      } catch (error) {
        console.error('Error fetching campaign slider:', error);
      }
    };

    fetchCampaignSlider();
  }, []);

  return (
    <Carousel autoplay>
      {slides.map((slide, index) => (
        <div key={index}>
          <a href={slide.link} target="_blank" rel="noopener noreferrer">
            <img
              src={slide.imageUrl}
              alt={`slide-${index}`}
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          </a>
        </div>
      ))}
    </Carousel>
  );
};

export default CampaignSlider;
