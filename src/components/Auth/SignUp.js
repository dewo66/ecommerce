import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignUp = async (values) => {
    try {
      // Kullanıcıyı kontrol etmek için API isteği gönderin
      const response = await fetch('http://localhost:3000/api/users');
      const users = await response.json();

      // Eğer aynı email ile kayıtlı kullanıcı varsa hata mesajı gösterin
      const userExists = users.some((user) => user.email === values.email);
      const userExists2 = users.some((user) => user.username === values.username);

      if (userExists || userExists2 ) {
        message.error('Bu email veya username adresi zaten kayıtlı.');
        return;
      }

      // Yeni kullanıcı nesnesini oluşturun
      const newUser = {
        username: values.username,
        email: values.email,
        password: values.password,
        tel: values.tel
      };

      // Yeni kullanıcıyı API'ye kaydedin
      const registerResponse = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      console.log(registerResponse)

      // Başarısız durumda hata fırlatın
      if (!registerResponse.ok) {
        const errorData = await registerResponse.json(); // Sunucudan dönen hata mesajını alın
        throw new Error(`Kayıt başarısız oldu. Hata: ${errorData.message}`);
      }

      // Başarılı mesajını gösterin
      message.success('Kayıt işlemi başarılı!');

      // Ana sayfaya yönlendirin
      navigate('/');

    } catch (error) {
      console.error('Kullanıcı kaydı yapılırken hata oluştu:', error);
      message.error('Kullanıcı kaydı sırasında hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h1>Kayıt Ol</h1>
      <Form onFinish={handleSignUp} layout="vertical">
        <Form.Item
          label="Kullanıcı Adı"
          name="username"
          rules={[{ required: true, message: 'Lütfen kullanıcı adınızı girin!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Lütfen email adresinizi girin!' },
            { type: 'email', message: 'Lütfen geçerli bir email adresi girin.' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Telefon Numarası"
          name="tel"
          rules={[{ required: true, message: 'Lütfen telefon numaranızı girin!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Şifre"
          name="password"
          rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Kayıt Ol
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUp;
