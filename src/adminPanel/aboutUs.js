import React, { Component } from 'react';
import { Layout, Typography, Card, Col, Row, Form, Input, Button, Modal, Upload, message } from 'antd';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default class AboutUs extends Component {
  state = {
    aboutUs: {},
    isModalVisible: false,
    form: {
      content: '',
      image_url: ''
    }
  };

  componentDidMount() {
    this.fetchAboutUs();
  }

  fetchAboutUs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/about_us/1'); // Assuming there's only one entry
      this.setState({ aboutUs: response.data, form: { content: response.data.content, image_url: response.data.image_url } });
    } catch (error) {
      console.error('Error fetching about us:', error);
    }
  };

  handleUpdate = async (values) => {
    try {
      await axios.put('http://localhost:3000/api/about_us/1', values); // Assuming there's only one entry
      message.success('About us updated successfully');
      this.setState({ isModalVisible: false });
      this.fetchAboutUs();
    } catch (error) {
      console.error('Error updating about us:', error);
      message.error('Failed to update about us');
    }
  };

  showEditModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { aboutUs, isModalVisible, form } = this.state;

    return (
      <Layout>
        <Content style={{ padding: '0 50px', marginTop: '64px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Title level={2}>Hakkımızda</Title>
            <Paragraph>{aboutUs.content}</Paragraph>
            {aboutUs.image_url && (
              <img src={aboutUs.image_url} alt="About Us" style={{ maxWidth: '100%', height: 'auto' }} />
            )}
            <Button type="primary" onClick={this.showEditModal} style={{ marginTop: 16 }}>
              Edit
            </Button>
          </div>
          <Modal
            title="Edit About Us"
            visible={isModalVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <Form
              initialValues={form}
              onFinish={this.handleUpdate}
            >
              <Form.Item
                name="content"
                label="Content"
                rules={[{ required: true, message: 'Please input the content!' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="image_url"
                label="Image URL"
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    );
  }
}
