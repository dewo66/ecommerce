import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Divider, Tree, Checkbox, Input, Select, Slider, Button } from 'antd';
import ProductCard from '../components/Product/ProductCard';
import axios from 'axios';

const { Search } = Input;
const { Option } = Select;

const CategoryFilter = () => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [visibleProductCount, setVisibleProductCount] = useState(20);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const filterProducts = useCallback((selectedKeys) => {
    let filteredProducts = [];

    selectedKeys.forEach(key => {
      const [mainCategory, subCategory] = key.split('-');
      const filtered = products.filter(product =>
        product.category.includes(mainCategory) && product.category.includes(subCategory)
      );
      filteredProducts = [...filteredProducts, ...filtered];
    });

    filteredProducts = filteredProducts.filter(
      product =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    const uniqueProducts = Array.from(new Set(filteredProducts.map(product => product.id)))
      .map(id => filteredProducts.find(product => product.id === id));

    setSelectedProducts(uniqueProducts);
    setVisibleProducts(uniqueProducts.slice(0, visibleProductCount));
  }, [priceRange, products, visibleProductCount]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

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

  useEffect(() => {
    filterProducts(selectedKeys);
  }, [selectedKeys, filterProducts]);

  const handleCategorySelect = (selectedKeys, info) => {
    setSelectedKeys(selectedKeys);
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const generateTreeData = () => {
    return categories.map(category => ({
      title: category.title,
      key: category.title.toLowerCase(),
      children: category.subcategories
        .filter(subcategory =>
          subcategory.toLowerCase().includes(searchText)
        )
        .map(subcategory => ({
          title: (
            <Checkbox
              key={`${category.title.toLowerCase()}-${subcategory.toLowerCase()}`}
              onChange={e => handleCategorySelect(e.target.checked ?
                [...selectedKeys, `${category.title.toLowerCase()}-${subcategory.toLowerCase()}`] :
                selectedKeys.filter(key => key !== `${category.title.toLowerCase()}-${subcategory.toLowerCase()}`))}
            >
              {subcategory}
            </Checkbox>
          ),
          key: `${category.title.toLowerCase()}-${subcategory.toLowerCase()}`,
        })),
    }));
  };

  const loadMoreProducts = () => {
    setVisibleProductCount(visibleProductCount + 10);
    setVisibleProducts(selectedProducts.slice(0, visibleProductCount + 10));
  };

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Divider orientation="left">Kategoriler</Divider>
        <Search
          placeholder="Kategori ara..."
          onChange={e => handleSearch(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Tree
          showLine
          defaultExpandedKeys={['manav', 'taze', 'soğuk']}
          onSelect={handleCategorySelect}
          selectedKeys={selectedKeys}
        >
          {generateTreeData().map(node => (
            <Tree.TreeNode key={node.key} title={node.title}>
              {node.children.map(child => (
                <Tree.TreeNode key={child.key} title={child.title} />
              ))}
            </Tree.TreeNode>
          ))}
        </Tree>
        <Divider orientation="left">Filtreler</Divider>
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 8 }}>Fiyat Aralığı:</span>
          <Slider
            range
            min={0}
            max={1000}
            defaultValue={priceRange}
            onChange={handlePriceChange}
          />
          <div style={{ marginTop: 8 }}>
            <span style={{ marginRight: 8 }}>₺{priceRange[0]}</span>
            <span>₺{priceRange[1]}</span>
          </div>
        </div>
        <div>
          <span style={{ marginRight: 8 }}>Satıcı:</span>
          <Select
            style={{ width: '100%' }}
            placeholder="Satıcı seçin"
            dropdownClassName="category-filter-select-dropdown"
          >
            <Option value="seller1">Satıcı 1</Option>
            <Option value="seller2">Satıcı 2</Option>
            <Option value="seller3">Satıcı 3</Option>
          </Select>
        </div>
      </Col>
      <Col span={18}>
        <Divider orientation="left">Ürünler</Divider>
        <Row gutter={16}>
          {visibleProducts.map(product => (
            <Col span={8} key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
        {visibleProductCount < selectedProducts.length && (
          <div className="load-more-button">
            <Button type="primary" onClick={loadMoreProducts}>
              Daha Fazla Ürün Yükle
            </Button>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default CategoryFilter;
