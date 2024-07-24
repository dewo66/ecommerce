// src/components/Auth/Login.js

import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Kullanıcıyı kontrol etmek için API isteği gönderin
      const response = await fetch('http://localhost:3000/api/users');
      const users = await response.json();

      // Kullanıcıyı bulun ve doğrulayın
      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        message.success('Login successful!');
        navigate('/');
      } else {
        message.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Error checking user data:', error);
      message.error('Error checking user data. Please try again later.');
    }
  };

  return (
    <Form onFinish={handleLogin} layout="vertical">
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;



