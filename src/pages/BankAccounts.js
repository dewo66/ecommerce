import React, { useEffect, useState } from 'react';
import { Layout, Typography, List, Card } from 'antd';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const BankAccounts = () => {
  const [bankAccounts, setBankAccounts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/bank_accounts')
      .then(response => response.json())
      .then(data => setBankAccounts(data))
      .catch(error => console.error('Error fetching bank accounts:', error));
  }, []);

  return (
    <Layout>
      <Content style={{ padding: '0 50px', marginTop: '64px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Title level={2}>Banka Hesaplarımız</Title>
          <Paragraph>
            Aşağıda, şirketimizin banka hesap bilgilerini bulabilirsiniz.
          </Paragraph>
          <List
            itemLayout="horizontal"
            dataSource={bankAccounts}
            renderItem={(item) => (
              <List.Item>
                <Card
                  title={item.bank_name}
                  style={{ width: '100%' }}
                >
                  <Paragraph><strong>Hesap Numarası:</strong> {item.account_number}</Paragraph>
                  <Paragraph><strong>IBAN:</strong> {item.iban}</Paragraph>
                  <Paragraph><strong>SWIFT Kodu:</strong> {item.swift_code}</Paragraph>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default BankAccounts;
