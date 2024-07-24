import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Ürünler yüklenirken hata oluştu:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata oluştu:', error);
    }
  };

  const handleAddProduct = () => {
    setIsModalVisible(true);
    setSelectedProductId(null);
  };

  const handleEditProduct = (record) => {
    setIsModalVisible(true);
    setSelectedProductId(record.id);
    const categoryList = record.category.split(',').map(cat => cat.trim());
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      price: record.price,
      imageUrl: record.imageUrl,
      stock: record.stock,
      category: categoryList.filter((_, index) => index % 2 === 0), // main categories
      subcategory: categoryList.filter((_, index) => index % 2 !== 0), // subcategories
    });
  };

  const handleDeleteProduct = async (record) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${record.id}`);
      fetchProducts();
    } catch (error) {
      console.error('Ürün silinirken hata oluştu:', error);
    }
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(async (values) => {
        const categoryList = values.category.map((cat, index) => `${cat}, ${values.subcategory[index] || ''}`).join(', ');
        values.category = categoryList.toLowerCase(); // Converting to lowercase

        try {
          if (selectedProductId) {
            await axios.put(`http://localhost:3000/api/products/${selectedProductId}`, values);
          } else {
            await axios.post('http://localhost:3000/api/products', values);
          }
          setIsModalVisible(false);
          form.resetFields();
          fetchProducts();
        } catch (error) {
          console.error('Ürün kaydedilirken hata oluştu:', error);
        }
      })
      .catch(info => {
        console.log('Form validasyon hatası:', info);
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedProductId(null);
    form.resetFields();
  };

  const handleCategoryChange = (value) => {
    const selectedCategories = value; // Array of selected categories
    let allSubcategories = [];
    selectedCategories.forEach(category => {
      const selectedCategory = categories.find(cat => cat.title === category);
      if (selectedCategory) {
        allSubcategories = allSubcategories.concat(selectedCategory.subcategories);
      }
    });
    setSubcategories(allSubcategories);
    form.setFieldsValue({ subcategory: [] }); // Reset subcategory field
  };

  const columns = [
    { title: 'Ürün Adı', dataIndex: 'name', key: 'name' },
    { title: 'Fiyat', dataIndex: 'price', key: 'price' },
    { title: 'Kategori', dataIndex: 'category', key: 'category' },
    {
      title: 'Aksiyon',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button icon={<EditOutlined />} onClick={() => handleEditProduct(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteProduct(record)} />
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2>Ürünler</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>Ürün Ekle</Button>
      <Table dataSource={products} rowKey="id" columns={columns} />

      <Modal
        title={selectedProductId ? "Ürün Düzenle" : "Ürün Ekle"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Ürün Adı" rules={[{ required: true, message: 'Lütfen ürün adını girin!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Açıklama" rules={[{ required: true, message: 'Lütfen açıklama girin!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Fiyat" rules={[{ required: true, message: 'Lütfen fiyat girin!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="imageUrl" label="Resim URL" rules={[{ required: true, message: 'Lütfen resim URL girin!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="stock" label="Stok" rules={[{ required: true, message: 'Lütfen stok miktarını girin!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Kategori" rules={[{ required: true, message: 'Lütfen kategori seçin!' }]}>
            <Select
              mode="multiple"
              placeholder="Kategorileri seçin"
              onChange={handleCategoryChange}
            >
              {categories.map(category => (
                <Option key={category.id} value={category.title}>
                  {category.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="subcategory" label="Alt Kategori" rules={[{ required: true, message: 'Lütfen alt kategori seçin!' }]}>
            <Select
              mode="multiple"
              placeholder="Alt kategorileri seçin"
              disabled={!subcategories.length}
            >
              {subcategories.map(subcategory => (
                <Option key={subcategory} value={subcategory}>
                  {subcategory}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
