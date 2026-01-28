import React from 'react';
import { List, Card, Button, Typography, InputNumber, Row, Col, Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Cart = () => {
    const { items, removeFromCart, total, clearCart } = useCart();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Empty description={<span style={{ color: '#fff' }}>Your cart is empty</span>} />
                <Button type="primary" onClick={() => navigate('/')} style={{ marginTop: 20 }}>
                    Start Shopping
                </Button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2} style={{ color: '#d4af37' }}>Shopping Cart</Title>
            <Row gutter={24}>
                <Col xs={24} md={16}>
                    <List
                        dataSource={items}
                        renderItem={(item) => (
                            <Card style={{ marginBottom: 10 }}>
                                <Row align="middle" gutter={16}>
                                    <Col span={4}>
                                        <img src={item.imageUrl} alt={item.name} style={{ width: '100%', borderRadius: 4 }} />
                                    </Col>
                                    <Col span={8}>
                                        <Text strong style={{ fontSize: 16 }}>{item.name}</Text>
                                    </Col>
                                    <Col span={4}>
                                        <Text>${item.price}</Text>
                                    </Col>
                                    <Col span={4}>
                                        <Text>Qty: {item.quantity}</Text>
                                    </Col>
                                    <Col span={4} style={{ textAlign: 'right' }}>
                                        <Button danger icon={<DeleteOutlined />} onClick={() => removeFromCart(item.id)} />
                                    </Col>
                                </Row>
                            </Card>
                        )}
                    />
                </Col>
                <Col xs={24} md={8}>
                    <Card title={<span style={{ color: '#d4af37' }}>Order Summary</span>}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Text>Subtotal</Text>
                            <Text strong>${total.toFixed(2)}</Text>
                        </div>
                        <Button type="primary" block size="large" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Cart;
