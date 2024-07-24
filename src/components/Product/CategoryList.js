import React, { useEffect, useState } from 'react';
import { Row, Col, Typography } from 'antd';
import axios from 'axios';
import ProductCard from './ProductCard';

const { Title } = Typography;

const CategoryList = ({ category, title }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => product.category.includes(category));

  return (
    <div style={{ marginBottom: '20px' }}>
      <Title level={3}>{title}</Title>
      <Row gutter={[16, 16]}>
        {filteredProducts.map(product => (
          <Col span={6} key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategoryList;
