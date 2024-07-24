// Footer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col } from 'antd';

const Footer = () => {
  const [footerData, setFooterData] = useState([]);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/footer-links');
        setFooterData(response.data);
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer style={{ textAlign: 'center', padding: '20px 0', backgroundColor: '#f0f0f0' }}>
      <Row gutter={[16, 16]}>
        {footerData.map((section, index) => (
          <Col key={index} xs={24} sm={12} md={4}>
            <h4>{section.title}</h4>
            {index === 0 ? (
              <div>
                <img src={section.imageUrl} alt="Bölüm 1 Logo" style={{ width: '100px', height: 'auto' }} />
                <p>{section.aboutText}</p>
                <div>
                  {section.socialMedia && section.socialMedia.map((social, socialIndex) => (
                    <a key={socialIndex} href={social.url} style={{ margin: '0 5px' }}>
                      <img src={social.logo} alt={`${social.name} logo`} style={{ width: '24px', height: '24px' }} />
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {section.links && section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.url}>{link.text}</a>
                  </li>
                ))}
              </ul>
            )}
          </Col>
        ))}
      </Row>
      <div style={{ marginTop: '20px' }}>
        © 2024 Demo E-commerce
      </div>
    </footer>
  );
};

export default Footer;
