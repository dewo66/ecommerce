// src/components/AboutUs.js
import React, { useEffect, useState } from 'react';
import { Layout, Typography, Card, Col, Row } from 'antd';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const AboutUs = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/about_us');
        console.log(response)
        setContent(response.data.content);
      } catch (error) {
        console.error('Error fetching about us content:', error);
      }
    };

    fetchContent();
  }, []);

  return (
    <Layout>
      <Content style={{ padding: '0 50px', marginTop: '64px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Title level={2}>Hakkımızda</Title>
          <Paragraph>{content}</Paragraph>
        </div>
      </Content>
    </Layout>
  );
};

export default AboutUs;
