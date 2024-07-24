import React, { useState } from 'react';
import { Card, Button, InputNumber, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  const addToCart = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      let cartItems = JSON.parse(localStorage.getItem(`mycart_${loggedInUser.id}`)) || [];
      const existingItem = cartItems.find(item => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity + quantity <= product.stock) {
          existingItem.quantity += quantity;
          message.success('Product quantity updated in cart!');
        } else {
          message.error('Cannot add more than available stock.');
        }
      } else if (quantity > product.stock) {
        message.error('Out of stock!');
      } else {
        cartItems.push({ ...product, quantity });
        message.success('Product added to cart!');
      }

      localStorage.setItem(`mycart_${loggedInUser.id}`, JSON.stringify(cartItems));
      window.dispatchEvent(new Event('storage'));
    } else {
      message.error('Please log in to add products to your cart.');
    }
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`, { state: { product } }); // Yönlendirme
  };

  return (
    <Card
      hoverable
      style={{ width: '100%' }}
      cover={<img alt={product.name} src={product.imageUrl} onClick={handleClick}  style={{ height: '200px', objectFit: 'cover' }} />}
    >
      <div  onClick={handleClick} >
      <br></br>
      {product.description}
      <hr></hr>
      <Card.Meta title={product.name} description={`$${product.price}`} />
      <p>Stock: {product.stock}</p>
      </div>
      <div style={{ marginTop: '10px' }}>
        <InputNumber
          min={1}
          max={product.stock}
          defaultValue={1}
          onChange={handleQuantityChange}
        />
        <Button type="primary" onClick={addToCart} disabled={product.stock <= 0}>
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
