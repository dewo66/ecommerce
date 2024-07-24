import React, { useState, useEffect } from 'react';
import { Menu, Row, Col, Card, Button, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Meta } = Card;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState('profile');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  const handleMenuClick = (e) => {
    setSelectedMenu(e.key);
  };

  const handleEdit = (type) => {
    setModalType(type);
    setIsModalVisible(true);
    if (type === 'profile') {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        tel: user.tel,
      });
    } else if (type === 'adresBilgileri') {
      form.setFieldsValue({
        adresBilgileri: user.adresBilgileri,
      });
    } else if (type === 'siparisBilgileri') {
      form.setFieldsValue({
        siparisBilgileri: user.siparisBilgileri,
      });
    } else if (type === 'odemeBilgileri') {
      form.setFieldsValue({
        odemeBilgileri: user.odemeBilgileri,
      });
    } else if (type === 'password') {
      form.setFieldsValue({
        currentPassword: '',
        newPassword: '',
      });
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedUser = { ...user };

      if (modalType === 'profile') {
        updatedUser.username = values.username;
        updatedUser.email = values.email;
        updatedUser.tel = values.tel;
      } else if (modalType === 'adresBilgileri') {
        updatedUser.adresBilgileri = values.adresBilgileri;
      } else if (modalType === 'siparisBilgileri') {
        updatedUser.siparisBilgileri = values.siparisBilgileri;
      } else if (modalType === 'odemeBilgileri') {
        updatedUser.odemeBilgileri = values.odemeBilgileri;
      } else if (modalType === 'password') {
        updatedUser.password = values.newPassword; // Şifreyi güncelle
      }

      await axios.put(`http://localhost:3000/api/users/${user.id}`, updatedUser);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Veri güncellenirken hata oluştu:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Hesabımı silmek istiyor musunuz?',
      okText: 'Evet, sil',
      cancelText: 'Hayır',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3000/api/users/${user.id}`);
          localStorage.removeItem('user');
          window.location.href = '/'; // Ana sayfaya yönlendir
        } catch (error) {
          console.error('Hesap silinirken hata oluştu:', error);
        }
      },
    });
  };

  const renderContent = () => {
    if (!user) return <p>Loading...</p>;

    switch (selectedMenu) {
      case 'profile':
        return (
          <div>
            <h2>Profile</h2>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Tel: {user.tel}</p>
            <Button onClick={() => handleEdit('profile')} icon={<EditOutlined />}>Düzenle</Button>
            <Button onClick={() => handleEdit('password')} style={{ marginLeft: '10px' }}>Şifreyi Değiştir</Button>
            <Button onClick={showDeleteConfirm} style={{ marginLeft: '10px'}} icon={<DeleteOutlined />} type="danger">Hesabı Sil</Button>
          </div>
        );
      case 'adresBilgileri':
        return (
          <div>
            <h2>Adres Bilgileri</h2>
            <p>{user.adresBilgileri}</p>
            <Button onClick={() => handleEdit('adresBilgileri')} icon={<EditOutlined />}>Düzenle</Button>
          </div>
        );
      case 'siparisBilgileri':
        return (
          <div>
            <h2>Sipariş Bilgileri</h2>
            <p>{user.siparisBilgileri}</p>
            <Button onClick={() => handleEdit('siparisBilgileri')} icon={<EditOutlined />}>Düzenle</Button>
          </div>
        );
      case 'odemeBilgileri':
        return (
          <div>
            <h2>Ödeme Bilgileri</h2>
            <p>{user.odemeBilgileri}</p>
            <Button onClick={() => handleEdit('odemeBilgileri')} icon={<EditOutlined />}>Düzenle</Button>
          </div>
        );
      case 'satinAlmaGecmisi':
        return (
          <div>
            <h2>Satın Alma Geçmişi</h2>
            <Row gutter={[16, 16]}>
              {user.satinAlmaGecmisi.map((item, index) => (
                <Col span={24} key={index} style={{ marginBottom: '20px' }}>
                  <Card
                    hoverable
                    style={{ width: '100%' }}
                    cover={<img alt={item.urunAdi} src={item.urunResmi} />}
                  >
                    <Meta title={item.urunAdi} description={`Fiyat: ${item.fiyat} TL`} />
                    <p>Sipariş No: {item.siparisNo}</p>
                    <p>Alım Tarihi: {item.alimTarihi}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Menu
        onClick={handleMenuClick}
        style={{ width: 256, marginRight: 20 }}
        defaultSelectedKeys={['profile']}
        selectedKeys={[selectedMenu]}
        mode="inline"
      >
        <Menu.Item key="profile">Profile</Menu.Item>
        <Menu.Item key="adresBilgileri">Adres Bilgileri</Menu.Item>
        <Menu.Item key="siparisBilgileri">Sipariş Bilgileri</Menu.Item>
        <Menu.Item key="odemeBilgileri">Ödeme Bilgileri</Menu.Item>
        <Menu.Item key="satinAlmaGecmisi">Satın Alma Geçmişi</Menu.Item>
      </Menu>
      <div style={{ flexGrow: 1 }}>
        {renderContent()}
      </div>

      <Modal
        title={`Düzenle ${modalType}`}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          {modalType === 'profile' && (
            <>
              <Form.Item name="username" label="Kullanıcı Adı" rules={[{ required: true, message: 'Lütfen kullanıcı adı girin!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label="E-posta" rules={[{ required: true, message: 'Lütfen e-posta girin!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="tel" label="Telefon" rules={[{ required: true, message: 'Lütfen telefon numarası girin!' }]}>
                <Input />
              </Form.Item>
            </>
          )}
          {modalType === 'adresBilgileri' && (
            <Form.Item name="adresBilgileri" label="Adres Bilgileri" rules={[{ required: true, message: 'Lütfen adres bilgileri girin!' }]}>
              <Input.TextArea />
            </Form.Item>
          )}
          {modalType === 'siparisBilgileri' && (
            <Form.Item name="siparisBilgileri" label="Sipariş Bilgileri" rules={[{ required: true, message: 'Lütfen sipariş bilgileri girin!' }]}>
              <Input.TextArea />
            </Form.Item>
          )}
          {modalType === 'odemeBilgileri' && (
            <Form.Item name="odemeBilgileri" label="Ödeme Bilgileri" rules={[{ required: true, message: 'Lütfen ödeme bilgileri girin!' }]}>
              <Input.TextArea />
            </Form.Item>
          )}
          {modalType === 'password' && (
            <>
              <Form.Item name="currentPassword" label="Yeni Şifre" rules={[{ required: true, message: 'Lütfen yeni şifrenizi girin!' }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item name="newPassword" label="Yeni Şifreyi onayla" rules={[{ required: true, message: 'Lütfen yeni şifrenizi tekrar girin!' }]}>
                <Input.Password />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
