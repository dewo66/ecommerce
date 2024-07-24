import React, { Component } from 'react';
import { Table, Layout, Typography, Button, Form, Input, Modal, Popconfirm, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Content } = Layout;

export default class BankAccounts extends Component {
  state = {
    bankAccounts: [],
    isModalVisible: false,
    isEditing: false,
    currentAccount: {},
  };

  componentDidMount() {
    this.fetchBankAccounts();
  }

  fetchBankAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/bank_accounts');
      this.setState({ bankAccounts: response.data });
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    }
  };

  handleAdd = async (values) => {
    try {
      const response = await axios.post('http://localhost:3000/api/bank_accounts', values);
      message.success('Bank account added successfully');
      this.setState({ isModalVisible: false });
      this.fetchBankAccounts();
    } catch (error) {
      console.error('Error adding bank account:', error);
      message.error('Failed to add bank account');
    }
  };

  handleEdit = async (values) => {
    const { currentAccount } = this.state;
    try {
      await axios.put(`http://localhost:3000/api/bank_accounts/${currentAccount.id}`, values);
      message.success('Bank account updated successfully');
      this.setState({ isModalVisible: false, isEditing: false, currentAccount: {} });
      this.fetchBankAccounts();
    } catch (error) {
      console.error('Error updating bank account:', error);
      message.error('Failed to update bank account');
    }
  };

  handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/bank_accounts/${id}`);
      message.success('Bank account deleted successfully');
      this.fetchBankAccounts();
    } catch (error) {
      console.error('Error deleting bank account:', error);
      message.error('Failed to delete bank account');
    }
  };

  showAddModal = () => {
    this.setState({ isModalVisible: true, isEditing: false, currentAccount: {} });
  };

  showEditModal = (record) => {
    this.setState({ isModalVisible: true, isEditing: true, currentAccount: record });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false, isEditing: false, currentAccount: {} });
  };

  render() {
    const { bankAccounts, isModalVisible, isEditing, currentAccount } = this.state;

    const columns = [
      {
        title: 'Bank Name',
        dataIndex: 'bank_name',
        key: 'bank_name',
      },
      {
        title: 'Account Number',
        dataIndex: 'account_number',
        key: 'account_number',
      },
      {
        title: 'IBAN',
        dataIndex: 'iban',
        key: 'iban',
      },
      {
        title: 'SWIFT Code',
        dataIndex: 'swift_code',
        key: 'swift_code',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button type="primary" onClick={() => this.showEditModal(record)} style={{ marginRight: 8 }}>
              Edit
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this bank account?"
              onConfirm={() => this.handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger">Delete</Button>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <Layout>
        <Content style={{ padding: '0 50px', marginTop: '64px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Title level={2}>Bank Accounts</Title>
            <Button type="primary" onClick={this.showAddModal} style={{ marginBottom: 16 }}>
              Add Bank Account
            </Button>
            <Table dataSource={bankAccounts} columns={columns} rowKey="id" />
          </div>
          <Modal
            title={isEditing ? 'Edit Bank Account' : 'Add Bank Account'}
            visible={isModalVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <Form
              initialValues={currentAccount}
              onFinish={isEditing ? this.handleEdit : this.handleAdd}
            >
              <Form.Item
                name="bank_name"
                label="Bank Name"
                rules={[{ required: true, message: 'Please input the bank name!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="account_number"
                label="Account Number"
                rules={[{ required: true, message: 'Please input the account number!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="iban"
                label="IBAN"
                rules={[{ required: true, message: 'Please input the IBAN!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="swift_code"
                label="SWIFT Code"
                rules={[{ required: true, message: 'Please input the SWIFT code!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {isEditing ? 'Update' : 'Add'}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    );
  }
}
