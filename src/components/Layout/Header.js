// src/components/Layout/Header.js

import React from 'react';
import { Menu, Badge, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ showLogoOnly }) => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  const cartItems = loggedInUser
    ? JSON.parse(localStorage.getItem(`cart_${loggedInUser.id}`)) || []
    : [];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Menu mode="horizontal">
      <Menu.Item key="Logo">
        <Link to="/">
          {showLogoOnly ? (
            <img src="/path-to-your-logo/logo.png" alt="Logo" style={{ height: 30 }} />
          ) : (
            <img src="/path-to-your-logo/logo.png" alt="Logo" style={{ height: 30 }} />
          )}
        </Link>
      </Menu.Item>

      {loggedInUser && loggedInUser.isAdmin ? (
        <Menu.Item key="AdminPanel">
          <Link to="/AdminPanel">
            Admin Panel
          </Link>
        </Menu.Item>
      ) : null}

      {!showLogoOnly && (
        <>
          <Menu.Item key="CategoryFilter" style={{ float: 'right' }}>
            <Link to="/CategoryFilter">Category Filter</Link>
          </Menu.Item>

          <Menu.Item key="cart" style={{ float: 'right' }}>
            <Link to="/MyCart">
              <Badge count={cartItems.length}>
                <ShoppingCartOutlined style={{ fontSize: '20px' }} />
              </Badge>
              <span style={{ marginLeft: '6px' }}>My Cart</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="aboutUs" style={{ float: 'right' }}>
            <Link to="/aboutUs">
              <span style={{ marginLeft: '6px' }}>About Us</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="ContactUs" style={{ float: 'right' }}>
            <Link to="/ContactUs">
              <span style={{ marginLeft: '6px' }}>Contact Us</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="BankAccounts" style={{ float: 'right' }}>
            <Link to="/BankAccounts">
              <span style={{ marginLeft: '6px' }}>Bank Accounts</span>
            </Link>
          </Menu.Item>

          {loggedInUser ? (
            <>
              <Menu.Item key="profile" style={{ float: 'right' }}>
                <Link to="/profile">Profile</Link>
              </Menu.Item>
              <Menu.Item key="logout" style={{ float: 'right' }}>
                <Button onClick={handleLogout}>Logout</Button>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item key="login" style={{ float: 'right' }}>
                <Link to="/login">Login</Link>
              </Menu.Item>
              <Menu.Item key="signup" style={{ float: 'right' }}>
                <Link to="/signup">Sign Up</Link>
              </Menu.Item>
            </>
          )}
        </>
      )}
    </Menu>
  );
};

export default Header;
