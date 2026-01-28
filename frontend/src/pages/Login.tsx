import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Mock login for now if backend isn't ready or if user wants to play with ui
            // Remove mock when backend is fully integrated
            const res = await api.post('/auth/login', values).catch(err => {
                // for demo purposes allow fallback
                if (values.email === 'admin@admin.com') {
                    return { data: { token: 'mock-token', role: 'ROLE_ADMIN', name: 'Admin User' } };
                }
                throw err;
            });

            login(res.data.token, { name: res.data.name, role: res.data.role });
            message.success('Login successful!');
            navigate('/');
        } catch (err) {
            message.error('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Title level={2} style={{ color: '#d4af37' }}>Login</Title>
                </div>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your Email!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                            Log in
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        Or <Link to="/register">register now!</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
