import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'antd';
import axios from 'axios';
import ProductCard from '../components/Product/ProductCard';

const CategoryPage = () => {
  const { mainCategory, subCategory } = useParams(); // URL parametrelerini alın

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        const products = response.data;

        let filtered;
        if (subCategory) {
          // Hem ana kategori hem de alt kategori ile filtreleme
          filtered = products.filter((product) => {
            const categories = product.category.split(',').map(cat => cat.trim().toLowerCase());
            return categories.includes(mainCategory) && categories.includes(subCategory);
          });
        } else {
          // Sadece ana kategori ile filtreleme
          filtered = products.filter((product) => {
            const categories = product.category.split(',').map(cat => cat.trim().toLowerCase());
            return categories.includes(mainCategory);
          });
        }

        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [mainCategory, subCategory]);

  return (
    <Row gutter={16}>
      {filteredProducts.map((product) => (
        <Col span={8} key={product.id}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
};

export default CategoryPage;
