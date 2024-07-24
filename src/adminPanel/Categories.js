import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata oluştu:', error);
    }
  };

  const handleAddCategory = () => {
    setIsModalVisible(true);
    setSelectedCategoryId(null);
  };

  const handleEditCategory = (record) => {
    setIsModalVisible(true);
    setSelectedCategoryId(record.id);
    form.setFieldsValue({
      title: record.title,
      subcategories: record.subcategories,
    });
  };

  const handleDeleteCategory = async (record) => {
    try {
      await axios.delete(`http://localhost:3000/api/categories/${record.id}`);
      fetchCategories();
    } catch (error) {
      console.error('Kategori silinirken hata oluştu:', error);
    }
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(async (values) => {
        try {
          if (selectedCategoryId) {
            await axios.put(`http://localhost:3000/api/categories/${selectedCategoryId}`, values);
          } else {
            await axios.post('http://localhost:3000/api/categories', values);
          }
          setIsModalVisible(false);
          form.resetFields();
          fetchCategories();
        } catch (error) {
          console.error('Kategori kaydedilirken hata oluştu:', error);
        }
      })
      .catch(info => {
        console.log('Form validasyon hatası:', info);
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedCategoryId(null);
    form.resetFields();
  };

  const columns = [
    { title: 'Kategori Adı', dataIndex: 'title', key: 'title' },
    {
      title: 'Alt Kategoriler',
      dataIndex: 'subcategories',
      key: 'subcategories',
      render: (subcategories) => subcategories.join(', '),
    },
    {
      title: 'Aksiyon',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button icon={<EditOutlined />} onClick={() => handleEditCategory(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteCategory(record)} />
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2>Kategoriler</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>Kategori Ekle</Button>
      <Table dataSource={categories} rowKey="id" columns={columns} />

      <Modal
        title={selectedCategoryId ? "Kategori Düzenle" : "Kategori Ekle"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Kategori Adı" rules={[{ required: true, message: 'Lütfen kategori adını girin!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="subcategories" label="Alt Kategoriler" rules={[{ required: false, message: 'Lütfen alt kategori girin!' }]}>
            <Select
              mode="tags"
              placeholder="Alt kategorileri girin"
            >
              {form.getFieldValue('subcategories')?.map(subcategory => (
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

export default Categories;
