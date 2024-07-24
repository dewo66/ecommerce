import React, { Component } from 'react';
import { Table, Layout, Typography, Button, Popconfirm, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Content } = Layout;

export default class Contact extends Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    this.fetchMessages();
  }

  fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/contact_messages');
      this.setState({ messages: response.data });
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    }
  };

  handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/contact_messages/${id}`);
      message.success('Message deleted successfully');
      this.fetchMessages(); // Refresh the list of messages
    } catch (error) {
      console.error('Error deleting contact message:', error);
      message.error('Failed to delete message');
    }
  };

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Message',
        dataIndex: 'message',
        key: 'message',
      },
      {
        title: 'Date',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => new Date(text).toLocaleString(),
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Popconfirm
            title="Are you sure you want to delete this message?"
            onConfirm={() => this.handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        ),
      },
    ];

    return (
      <Layout>
        <Content style={{ padding: '0 50px', marginTop: '64px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Title level={2}>Contact Messages</Title>
            <Table
              dataSource={this.state.messages}
              columns={columns}
              rowKey="id"
            />
          </div>
        </Content>
      </Layout>
    );
  }
}
