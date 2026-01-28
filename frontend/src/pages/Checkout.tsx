import { useState } from 'react';
import { Card, Form, Input, Button, Steps, Typography, Row, Col, Divider, Alert } from 'antd';
import { ShoppingCartOutlined, CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Step } = Steps;

const Checkout = () => {
    const { items, total, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const orderPayload = {
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                })),
                guestInfo: !isAuthenticated ? {
                    email: values.email,
                    fullName: values.fullName,
                    address: values.address
                } : null
            };

            await api.post('/orders', orderPayload);
            clearCart();
            setCurrentStep(2); // Success step
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0 && currentStep !== 2) {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <Title level={3}>Your cart is empty</Title>
                <Button type="primary" onClick={() => navigate('/products')}>Browse Shop</Button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '60px 20px', maxWidth: '1000px' }}>
            <Steps current={currentStep} style={{ marginBottom: 60 }} items={[
                { title: 'Cart Review', icon: <ShoppingCartOutlined /> },
                { title: 'Payment Info', icon: <CreditCardOutlined /> },
                { title: 'Confirmation', icon: <CheckCircleOutlined /> }
            ]} />

            {/* Step 1: Cart Review (Skipped for brevity, assume user came from Cart page) */}
            {currentStep === 0 && (
                <Row gutter={40}>
                    <Col xs={24} md={14}>
                        <Card title="Shipping Details" bordered={false} style={{ background: '#1c1c1c' }}>
                            {!isAuthenticated && (
                                <Alert
                                    message="Guest Checkout"
                                    description="You are checking out as a guest. No account required."
                                    type="info"
                                    showIcon
                                    style={{ marginBottom: 20 }}
                                />
                            )}
                            <Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ email: user?.name ? 'user@example.com' : '' }}>
                                <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                                    <Input size="large" />
                                </Form.Item>
                                {!isAuthenticated && (
                                    <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                                        <Input size="large" />
                                    </Form.Item>
                                )}
                                <Form.Item name="address" label="Shipping Address" rules={[{ required: true }]}>
                                    <Input.TextArea rows={3} />
                                </Form.Item>
                                <Form.Item label="Payment Method">
                                    <Input disabled value="Credit Card (Mock)" />
                                </Form.Item>

                                <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ height: '50px' }}>
                                    Place Order (${total.toFixed(2)})
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                    <Col xs={24} md={10}>
                        <Card title="Order Summary" bordered={false} style={{ background: '#1c1c1c' }}>
                            {items.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                                    <Text>{item.quantity}x {item.name}</Text>
                                    <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                                </div>
                            ))}
                            <Divider />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Title level={4}>Total</Title>
                                <Title level={4} style={{ color: '#d4af37' }}>${total.toFixed(2)}</Title>
                            </div>
                        </Card>
                    </Col>
                </Row>
            )}

            {currentStep === 2 && (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <CheckCircleOutlined style={{ fontSize: '80px', color: '#52c41a', marginBottom: '20px' }} />
                    <Title level={2}>Order Placed!</Title>
                    <Text type="secondary" style={{ fontSize: '16px' }}>Thank you for your purchase. You will receive an email confirmation shortly.</Text>
                    <div style={{ marginTop: '40px' }}>
                        <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
