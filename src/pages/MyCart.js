import React, { useEffect, useState } from 'react';
import { List, Button, Typography, message } from 'antd';
import { PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartItems = () => {
      const loggedInUser = JSON.parse(localStorage.getItem('user'));
      if (loggedInUser) {
        const items = JSON.parse(localStorage.getItem(`mycart_${loggedInUser.id}`)) || [];
        setCartItems(items);
      }
    };

    window.addEventListener('storage', updateCartItems);
    updateCartItems();

    return () => {
      window.removeEventListener('storage', updateCartItems);
    };
  }, []);

  const handleIncrement = (index) => {
    const updatedCartItems = [...cartItems];
    const product = updatedCartItems[index];
    if (product.quantity < product.stock) {
      product.quantity++;
      setCartItems(updatedCartItems);
      updateLocalStorage(updatedCartItems);
    } else {
      message.error('No more stock available.');
    }
  };

  const handleDecrement = (index) => {
    const updatedCartItems = [...cartItems];
    const product = updatedCartItems[index];
    if (product.quantity > 1) {
      product.quantity--;
      setCartItems(updatedCartItems);
      updateLocalStorage(updatedCartItems);
    }
  };

  const handleDelete = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);
    setCartItems(updatedCartItems);
    updateLocalStorage(updatedCartItems);
  };

  const updateLocalStorage = (items) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      localStorage.setItem(`mycart_${loggedInUser.id}`, JSON.stringify(items));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>My Cart</Title>
      <List
        itemLayout="horizontal"
        dataSource={cartItems}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button icon={<PlusOutlined />} onClick={() => handleIncrement(index)} />,
              <Button icon={<MinusOutlined />} onClick={() => handleDecrement(index)} />,
              <Button icon={<DeleteOutlined />} onClick={() => handleDelete(index)} danger />
            ]}
          >
            <List.Item.Meta
              title={item.name}
              description={`$${item.price} x ${item.quantity}`}
            />
          </List.Item>
        )}
      />
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Title level={4}>Total: ${calculateTotal()}</Title>
        <Button type="primary" onClick={handleCheckout}>Proceed to Checkout</Button>
      </div>
    </div>
  );
};

export default MyCart;
