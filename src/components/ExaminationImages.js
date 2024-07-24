import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import axios from 'axios';

const ExaminationImages = () => {
  const [examinationImages, setExaminationImages] = useState([]);

  useEffect(() => {
    const fetchExaminationImages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/examination');
        setExaminationImages(response.data);
      } catch (error) {
        console.error('Error fetching examination images:', error);
      }
    };

    fetchExaminationImages();
  }, []);

  return (
    <div style={{ margin: '20px 0' }}>
      <Row gutter={[16, 16]}>
        {examinationImages.map((image, index) => (
          <Col span={4} key={index}>
            <a href={image.link} target="_blank" rel="noopener noreferrer">
              <img
                src={image.imageUrl}
                alt={`examination-${index}`}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </a>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ExaminationImages;
