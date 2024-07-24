import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Menu } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import axios from 'axios';

import Products from './Products';
import Categories from './Categories';
import Headlines from './Headlines';
import StaticPages from './StaticPages';
import Sliders from './Sliders';
import Contact from './Contact.js'
import BankAccounts from './BankAccounts.js'
import AboutUs from './aboutUs.js';

const { SubMenu } = Menu;

const AdminPanel = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    // Veritabanından gerekli verileri çekme işlemleri
  }, []);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Menu onClick={({ key }) => handleMenuClick(key)} mode="horizontal">
        <Menu.Item key="urunler" icon={<UnorderedListOutlined />}>
          Ürünler
        </Menu.Item>
        <Menu.Item key="kategoriler" icon={<UnorderedListOutlined />}>
          Kategoriler
        </Menu.Item>
        <Menu.Item key="Headlines" icon={<UnorderedListOutlined />}>
        Headlines
        </Menu.Item>
        <Menu.Item key="statik-sayfalar" icon={<UnorderedListOutlined />}>
          Statik Sayfalar
        </Menu.Item>
        <Menu.Item key="sliders" icon={<UnorderedListOutlined />}>
          Sliders
        </Menu.Item>
        <Menu.Item key="contact" icon={<UnorderedListOutlined />}>
          Contact
        </Menu.Item>
        <Menu.Item key="BankAccounts" icon={<UnorderedListOutlined />}>
        BankAccounts
        </Menu.Item>
        <Menu.Item key="AboutUs" icon={<UnorderedListOutlined />}>
        AboutUs
        </Menu.Item>

      </Menu>

      <div style={{ padding: '20px' }}>
        {selectedMenu === 'urunler' && <Products />}
        {selectedMenu === 'kategoriler' && <Categories />}
        {selectedMenu === 'Headlines' && <Headlines />}
        {selectedMenu === 'statik-sayfalar' && <StaticPages />}
        {selectedMenu === 'sliders' && <Sliders />}
        {selectedMenu === 'contact' && <Contact />}
        {selectedMenu === 'BankAccounts' && <BankAccounts />}
        {selectedMenu === 'AboutUs' && <AboutUs />}



        {!selectedMenu && (
          <div>
            <h1>Admin Panel</h1>
            <p>Yönetici araçlarına buradan erişebilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
