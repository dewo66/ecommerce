import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'antd';
import ProductCard from '../components/Product/ProductCard';
import { products } from '../data/data';

const CategoryPage = () => {
  const { mainCategory, subCategory } = useParams(); // URL parametrelerini alın

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // URL parametrelerine göre ürünleri filtreleyin
    const filtered = products.filter((product) =>
      product.category.includes(mainCategory) && product.category.includes(subCategory)
    );
    setFilteredProducts(filtered);
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
