import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, InputNumber, message, Row, Col, Tag, Divider } from 'antd';
import ProductComments from './ProductComments';

const ProductDetail = () => {
  const location = useLocation();
  const { product } = location.state || {}; // Access the product data
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) {
      return;
    }
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      const cartItems = JSON.parse(localStorage.getItem(`mycart_${loggedInUser.id}`)) || [];
      const existingProduct = cartItems.find(item => item.id === product.id);
      if (existingProduct) {
        setQuantity(existingProduct.quantity);
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      message.error('Please log in to add products to your cart.');
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem(`mycart_${loggedInUser.id}`)) || [];
    const existingProduct = cartItems.find(item => item.id === product.id);

    if (existingProduct) {
      if (existingProduct.quantity + quantity > product.stock) {
        message.error('No more stock available.');
        return;
      }
      existingProduct.quantity += quantity;
    } else {
      cartItems.push({ ...product, quantity });
    }

    localStorage.setItem(`mycart_${loggedInUser.id}`, JSON.stringify(cartItems));
    window.dispatchEvent(new Event('storage'));
    message.success('Product added to cart successfully.');
  };

  const handleRemoveFromCart = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      message.error('Please log in to remove products from your cart.');
      return;
    }

    let cartItems = JSON.parse(localStorage.getItem(`mycart_${loggedInUser.id}`)) || [];
    cartItems = cartItems.filter(item => item.id !== product.id);

    localStorage.setItem(`mycart_${loggedInUser.id}`, JSON.stringify(cartItems));
    window.dispatchEvent(new Event('storage'));
    setQuantity(1);
    message.success('Product removed from cart successfully.');
  };

  const handleQuantityChange = (value) => {
    if (value <= product.stock) {
      setQuantity(value);
    } else {
      message.error('No more stock available.');
    }
  };

  if (!product) {
    return <div>No product details available.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        {(Array.isArray(product.category) ? product.category : [product.category]).map((cat, index) => (
          <Tag key={index} color="blue">{cat}</Tag>
        ))}
      </div>
      <Divider />
      <Row gutter={16}>
        <Col span={12}>
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
        </Col>
        <Col span={12}>
          <h1>{product.name}</h1>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p>{product.description}</p>
          <div style={{ marginBottom: '20px' }}>
            <InputNumber
              min={1}
              max={product.stock}
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
          <div>
            <Button type="primary" onClick={handleAddToCart}>Add to Cart</Button>
            <Button type="danger" onClick={handleRemoveFromCart} style={{ marginLeft: '10px' }}>Remove from Cart</Button>
          </div>
        </Col>
      </Row>
      <ProductComments productId={product.id} />
    </div>
  );
};

export default ProductDetail;
