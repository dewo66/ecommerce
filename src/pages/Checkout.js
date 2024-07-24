import React, { useState } from 'react';
import { Steps, Button, Form, Input, Select, Typography, List, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Step } = Steps;
const { Title } = Typography;
const { Option } = Select;

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Kullanıcı bilgilerini localStorage'dan al
  const userData = JSON.parse(localStorage.getItem('user'));
  
  // Adres bilgilerini varsayılan değerler olarak kullan
  const initialValues = {
    address: userData.adresBilgileri || '',
    billing: userData.siparisBilgileri || '',
    delivery: 'standard', // Varsayılan teslimat yöntemi
    paymentMethod: 'creditCard', // Varsayılan ödeme yöntemi
    installments: 1 // Varsayılan taksit sayısı
  };

  // Sepet öğelerini localStorage'dan al
  const cartItems = JSON.parse(localStorage.getItem(`mycart_${userData.id}`)) || [];

  // Adımlar dizisi
  const steps = [
    {
      title: 'Teslimat Bilgileri',
      content: (
        <Form layout="vertical" initialValues={initialValues}>
          <Form.Item label="Adres" name="address" rules={[{ required: true, message: 'Lütfen adresinizi girin!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Fatura Bilgisi" name="billing" rules={[{ required: true, message: 'Lütfen fatura bilginizi girin!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Teslimat Yöntemi" name="delivery" rules={[{ required: true, message: 'Lütfen teslimat yönteminizi seçin!' }]}>
            <Select>
              <Option value="standard">Standart</Option>
              <Option value="express">Express</Option>
            </Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Ödeme',
      content: (
        <Form layout="vertical">
          <Form.Item label="Ödeme Yöntemi" name="paymentMethod" rules={[{ required: true, message: 'Lütfen ödeme yönteminizi seçin!' }]}>
            <Select>
              <Option value="creditCard">Kredi Kartı</Option>
              <Option value="paypal">PayPal</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Taksit Sayısı" name="installments">
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Tamamlandı',
      content: (
        <div>
          <Title level={2}>Siparişiniz tamamlandı</Title>
          <p>Siparişiniz alındı ve yolda.</p>
        </div>
      ),
    },
  ];

  // Sonraki adıma geçme işlevi
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  // Önceki adıma geçme işlevi
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  // Toplam tutarı hesapla
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  // Eğer sepet boş ise mesaj göster
  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <Title level={3}>Sepetiniz boş</Title>
      </div>
    );
  }

  // Sepet dolu ise adımları ve sağdaki öğeleri göster
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      {/* Sol tarafta adımlar */}
      <div style={{ width: '60%' }}>
        <Steps current={currentStep}>
          {steps.map((step, index) => (
            <Step key={index} title={step.title} />
          ))}
        </Steps>
        <div style={{ marginTop: '20px' }}>{steps[currentStep].content}</div>
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={handleNext} style={{ marginRight: '10px' }}>
              İleri
            </Button>
          )}
          {currentStep > 0 && (
            <Button onClick={handlePrev} style={{ marginRight: '10px' }}>
              Geri
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Sipariş başarıyla alındı!')}>
              Tamamla
            </Button>
          )}
        </div>
      </div>

      {/* Sağ tarafta öğeler */}
      <div style={{ width: '30%' }}>
        <Title level={4}>Sepetinizdeki Öğeler</Title>
        <List
          itemLayout="horizontal"
          dataSource={cartItems}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={`$${item.price} x ${item.quantity}`}
              />
            </List.Item>
          )}
        />
        <p style={{ marginTop: '10px' }}>Toplam: ${totalAmount}</p>
      </div>
    </div>
  );
};

export default Checkout;
