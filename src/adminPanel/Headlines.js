import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const Headlines = () => {
  const [examinations, setExaminations] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedExaminationId, setSelectedExaminationId] = useState(null);

  useEffect(() => {
    fetchExaminations();
  }, []);

  const fetchExaminations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/examination');
      setExaminations(response.data);
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error);
    }
  };

  const handleAddExamination = () => {
    setIsModalVisible(true);
    setSelectedExaminationId(null);
  };

  const handleEditExamination = (record) => {
    setIsModalVisible(true);
    setSelectedExaminationId(record.id);
    form.setFieldsValue({
      imageUrl: record.imageUrl,
      link: record.link,
    });
  };

  const handleDeleteExamination = async (record) => {
    try {
      await axios.delete(`http://localhost:3000/api/examination/${record.id}`);
      fetchExaminations();
    } catch (error) {
      console.error('Veri silinirken hata oluştu:', error);
    }
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(async (values) => {
        try {
          if (selectedExaminationId) {
            await axios.put(`http://localhost:3000/api/examination/${selectedExaminationId}`, values);
          } else {
            await axios.post('http://localhost:3000/api/examination', values);
          }
          setIsModalVisible(false);
          form.resetFields();
          fetchExaminations();
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
    setSelectedExaminationId(null);
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
          <Button icon={<EditOutlined />} onClick={() => handleEditExamination(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteExamination(record)} />
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2>Examination</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddExamination}>Veri Ekle</Button>
      <Table dataSource={examinations} rowKey="id" columns={columns} />

      <Modal
        title={selectedExaminationId ? "Veri Düzenle" : "Veri Ekle"}
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

export default Headlines;
