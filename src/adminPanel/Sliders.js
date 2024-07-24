import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const Sliders = () => {
  const [sliders, setSliders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedSliderId, setSelectedSliderId] = useState(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/campaign-slider');
      setSliders(response.data);
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error);
    }
  };

  const handleAddSlider = () => {
    setIsModalVisible(true);
    setSelectedSliderId(null);
  };

  const handleEditSlider = (record) => {
    setIsModalVisible(true);
    setSelectedSliderId(record.id);
    form.setFieldsValue({
      imageUrl: record.imageUrl,
      link: record.link,
    });
  };

  const handleDeleteSlider = async (record) => {
    try {
      await axios.delete(`http://localhost:3000/api/campaign-slider/${record.id}`);
      fetchSliders();
    } catch (error) {
      console.error('Veri silinirken hata oluştu:', error);
    }
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(async (values) => {
        try {
          if (selectedSliderId) {
            await axios.put(`http://localhost:3000/api/campaign-slider/${selectedSliderId}`, values);
          } else {
            await axios.post('http://localhost:3000/api/campaign-slider', values);
          }
          setIsModalVisible(false);
          form.resetFields();
          fetchSliders();
        } catch (error) {
          console.error('Veri kaydedilirken hata oluştu:', error);
        }
      })
      .catch(info => {
        console.log('Form validasyon hatası:', info);
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedSliderId(null);
    form.resetFields();
  };

  const columns = [
    { title: 'Image URL', dataIndex: 'imageUrl', key: 'imageUrl' },
    { title: 'Link', dataIndex: 'link', key: 'link' },
    {
      title: 'Aksiyon',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button icon={<EditOutlined />} onClick={() => handleEditSlider(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteSlider(record)} />
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2>Campaign Slider</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSlider}>Veri Ekle</Button>
      <Table dataSource={sliders} rowKey="id" columns={columns} />

      <Modal
        title={selectedSliderId ? "Veri Düzenle" : "Veri Ekle"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="imageUrl" label="Image URL" rules={[{ required: true, message: 'Lütfen resim URL girin!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="link" label="Link" rules={[{ required: true, message: 'Lütfen link girin!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Sliders;
