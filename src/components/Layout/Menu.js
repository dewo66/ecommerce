import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu as AntMenu } from 'antd';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';

const { SubMenu } = AntMenu;

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories'); // API endpoint
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleMenuItemClick = (mainIndex, subIndex = null) => {
    const mainCategory = categories[mainIndex].title.toLowerCase();
    let path;

    if (subIndex !== null) {
      const subCategory = categories[mainIndex].subcategories[subIndex].toLowerCase();
      path = `/category/${mainCategory}/${subCategory}`;
      setSelectedKeys([`${mainIndex}-${subIndex}`]);
    } else {
      path = `/category/${mainCategory}`;
      setSelectedKeys([`${mainIndex}`]);
    }

    navigate(path);
  };

  const renderMenu = () => {
    if (loading) {
      return <LoadingOutlined style={{ fontSize: 24 }} spin />;
    }

    return (
      <AntMenu mode="horizontal" theme="dark" selectedKeys={selectedKeys}>
        {categories.map((category, index) => (
          <SubMenu key={index} title={category.title} onTitleClick={() => handleMenuItemClick(index)}>
            {category.subcategories.map((subcategory, subIndex) => (
              <AntMenu.Item
                key={`${index}-${subIndex}`}
                onClick={() => handleMenuItemClick(index, subIndex)}
              >
                {subcategory}
              </AntMenu.Item>
            ))}
          </SubMenu>
        ))}
      </AntMenu>
    );
  };

  return (
    <div ref={menuRef}>
      {renderMenu()}
    </div>
  );
};

export default Menu;
