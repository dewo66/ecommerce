import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const ContactUs = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/contact_messages', values);
      message.success('Mesajınız başarıyla gönderildi!');
      form.resetFields();
    } catch (error) {
      message.error('Mesaj gönderilirken bir hata oluştu!');
      console.error('Mesaj gönderilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>İletişim Formu</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Adınız"
          rules={[{ required: true, message: 'Lütfen adınızı girin!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-posta"
          rules={[{ required: true, message: 'Lütfen e-posta adresinizi girin!' }, { type: 'email', message: 'Geçerli bir e-posta adresi girin!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="message"
          label="Mesajınız"
          rules={[{ required: true, message: 'Lütfen mesajınızı girin!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Gönder
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};


export default ContactUs;

