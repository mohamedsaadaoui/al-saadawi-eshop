import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const res = await api.post('/auth/register', values);
            login(res.data.token, { name: res.data.name, role: res.data.role });
            message.success('Registration successful!');
            navigate('/');
        } catch (err: any) {
            if (err.response && err.response.data) {
                // Backend might return a string or an object, adapt as needed
                message.error(typeof err.response.data === 'string' ? err.response.data : 'Registration failed.');
            } else {
                message.error('Registration failed. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Title level={2} style={{ color: '#d4af37' }}>Register</Title>
                </div>
                <Form
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your Full Name!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your Email!' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                            Register
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;
