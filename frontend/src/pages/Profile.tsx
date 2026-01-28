import { useEffect, useState } from 'react';
import { Layout, Tabs, Typography, Card, Table, Tag, Button, Avatar, List, Descriptions, Spin, Row, Col, Statistic, Form, Input, Modal, message } from 'antd';
import { UserOutlined, ShoppingOutlined, SettingOutlined, LogoutOutlined, HistoryOutlined, EditOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface OrderItem {
    id: number;
    product: {
        name: string;
        price: number;
        imageUrl: string;
    };
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

const Profile = () => {
    const { user, logout, login } = useAuth(); // Assuming login or updateUser is available to update context state
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Mock extra user details since JWT only has basics. In a real app fit these from /me endpoint
    const [userDetails, setUserDetails] = useState({
        phone: "+1 (555) 000-0000",
        address: "123 Luxury Ave, Beverly Hills, CA 90210"
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleEditProfile = (values: any) => {
        // Here you would call API to update user details
        // api.put('/users/me', values)

        setUserDetails({
            phone: values.phone,
            address: values.address
        });

        // Update local auth context if name changed (mock update for now)
        // updateUser({ ...user, name: values.name }); 

        message.success('Profile updated successfully!');
        setIsEditModalVisible(false);
    };

    const orderColumns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (id: number) => <Text strong>#{id}</Text>,
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'PAID') color = 'gold';
                if (status === 'PENDING') color = 'blue';
                if (status === 'DELIVERED') color = 'green';
                if (status === 'CANCELLED') color = 'red';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => <Text strong>${amount.toFixed(2)}</Text>,
        },
    ];

    const AccountOverview = () => (
        <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
                <Card style={{ textAlign: 'center', background: '#1c1c1c', border: '1px solid #333' }}>
                    <div style={{ marginBottom: 20 }}>
                        <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#d4af37', fontSize: 40 }} />
                    </div>
                    <Title level={4} style={{ margin: 0 }}>{user?.name}</Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>{user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Valued Customer'}</Text>

                    <Button danger icon={<LogoutOutlined />} onClick={handleLogout} block>
                        Sign Out
                    </Button>
                </Card>
            </Col>
            <Col xs={24} md={16}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card style={{ background: '#1c1c1c', border: '1px solid #333' }}>
                            <Statistic
                                title={<span style={{ color: '#a0a0a0' }}>Total Orders</span>}
                                value={orders.length}
                                prefix={<ShoppingOutlined style={{ color: '#d4af37' }} />}
                                valueStyle={{ color: '#fff' }}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card style={{ background: '#1c1c1c', border: '1px solid #333' }}>
                            <Statistic
                                title={<span style={{ color: '#a0a0a0' }}>Member Since</span>}
                                value="2024"
                                prefix={<HistoryOutlined style={{ color: '#d4af37' }} />}
                                valueStyle={{ color: '#fff' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card
                    title={<span style={{ color: '#fff' }}>Account Details</span>}
                    extra={<Button type="link" icon={<EditOutlined />} onClick={() => {
                        form.setFieldsValue({
                            name: user?.name,
                            email: 'user@example.com', // In real app, from user object
                            phone: userDetails.phone,
                            address: userDetails.address
                        });
                        setIsEditModalVisible(true);
                    }}>Edit</Button>}
                    style={{ marginTop: 20, background: '#1c1c1c', border: '1px solid #333' }}
                    bordered={false}
                >
                    <Descriptions column={1} labelStyle={{ color: '#a0a0a0' }} contentStyle={{ color: '#fff' }}>
                        <Descriptions.Item label="Full Name">{user?.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">user@example.com (Hidden)</Descriptions.Item>
                        <Descriptions.Item label="Phone">{userDetails.phone}</Descriptions.Item>
                        <Descriptions.Item label="Address">{userDetails.address}</Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>
        </Row>
    );

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
            <Title level={2} style={{ marginBottom: 30, letterSpacing: '1px' }}>My Account</Title>

            <Tabs defaultActiveKey="1" tabPosition="left" type="card">
                <TabPane
                    tab={<span><UserOutlined />Overview</span>}
                    key="1"
                    style={{ paddingLeft: 20 }}
                >
                    <AccountOverview />
                </TabPane>

                <TabPane
                    tab={<span><ShoppingOutlined />Orders</span>}
                    key="2"
                    style={{ paddingLeft: 20 }}
                >
                    <Card title={<span style={{ color: '#fff' }}>Order History</span>} bordered={false} style={{ background: '#1c1c1c', border: '1px solid #333' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: 30 }}><Spin /></div>
                        ) : (
                            <Table
                                dataSource={orders}
                                columns={orderColumns}
                                rowKey="id"
                                pagination={{ pageSize: 5 }}
                                style={{ background: 'transparent' }}
                            />
                        )}
                    </Card>
                </TabPane>

                <TabPane
                    tab={<span><SettingOutlined />Settings</span>}
                    key="3"
                    style={{ paddingLeft: 20 }}
                >
                    <Card title={<span style={{ color: '#fff' }}>Account Settings</span>} style={{ background: '#1c1c1c', border: '1px solid #333' }}>
                        <Text style={{ color: '#a0a0a0' }}>Password and security settings will appear here.</Text>
                    </Card>
                </TabPane>
            </Tabs>

            <Modal
                title="Edit Profile"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleEditProfile}>
                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ type: 'email', required: true }]}>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone Number">
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Shipping Address">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Save Changes
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Profile;
