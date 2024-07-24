import React from 'react';
import { Carousel } from 'antd';

export default function Slider() {
  const slides = [
    {
      id: 1,
      content: 'Slider 1',
    },
    {
      id: 2,
      content: 'Slider 2',
    },
    {
      id: 3,
      content: 'Slider 3',
    },
    {
      id: 4,
      content: 'Slider 4',
    },
  ];

  return (
    <Carousel autoplay>
      {slides.map(slide => (
        <div key={slide.id}>
          <h3 style={{ height: '160px', color: '#fff', lineHeight: '160px', textAlign: 'center', background: '#364d79' }}>
            {slide.content}
          </h3>
        </div>
      ))}
    </Carousel>
  );
}
