import { useEffect, useState } from 'react';
import { Layout, Menu, Typography, Card, Row, Col, Statistic, List, Avatar, Table, Button, Modal, Select, message, Form, Input, InputNumber, Upload } from 'antd';
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    ShoppingOutlined,
    DollarOutlined,
    RiseOutlined,
    AppstoreOutlined,
    UploadOutlined,
    PlusOutlined
} from '@ant-design/icons';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
}

interface Order {
    id: number;
    user: { email: string };
    totalAmount: number;
    status: string;
    createdAt: string;
}

interface RecentActivityItem {
    title: string;
    desc: string;
    time: string;
}

const AdminDashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState("1");
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Calculate dynamic stats from real data
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;

    const stats = [
        { title: 'Total Revenue', value: totalRevenue, prefix: '$', icon: <DollarOutlined />, color: '#d4af37' },
        { title: 'Total Orders', value: totalOrders, prefix: '', icon: <ShoppingCartOutlined />, color: '#52c41a' },
        { title: 'Total Products', value: totalProducts, prefix: '', icon: <UserOutlined />, color: '#1890ff' },
        { title: 'Low Stock', value: lowStockProducts, prefix: '', icon: <RiseOutlined />, color: '#ef4444' },
    ];

    const recentActivity: RecentActivityItem[] = orders.slice(0, 5).map((order, index) => ({
        title: `Order #${order.id}`,
        desc: `${order.status} - $${order.totalAmount?.toFixed(2) || '0.00'}`,
        time: order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'Just now'
    }));

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, orderRes] = await Promise.all([
                api.get('/products'),
                api.get('/admin/orders')
            ]);
            setProducts(prodRes.data);
            setOrders(orderRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (orderId: number, status: string) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status });
            message.success('Order status updated');
            fetchData();
        } catch (err) {
            message.error('Failed to update status');
        }
    };

    const handleAddProduct = async (values: any) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description || '');
            formData.append('price', values.price);
            formData.append('stock', values.stock);

            if (values.image && values.image.file) {
                formData.append('image', values.image.file.originFileObj);
            }

            await api.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success('Product added successfully');
            setIsProductModalVisible(false);
            form.resetFields();
            fetchData();
        } catch (err) {
            console.error(err);
            message.error('Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    const productColumns = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Name', dataIndex: 'name' },
        { title: 'Price', dataIndex: 'price', render: (val: number) => `$${val}` },
        { title: 'Stock', dataIndex: 'stock' },
    ];

    const orderColumns = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'User', dataIndex: ['user', 'email'] },
        { title: 'Total', dataIndex: 'totalAmount', render: (val: number) => `$${val}` },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status: string, record: Order) => (
                <Select defaultValue={status} style={{ width: 120 }} onChange={(val) => handleStatusUpdate(record.id, val)}>
                    <Option value="PENDING">Pending</Option>
                    <Option value="PAID">Paid</Option>
                    <Option value="SHIPPED">Shipped</Option>
                    <Option value="DELIVERED">Delivered</Option>
                    <Option value="CANCELLED">Cancelled</Option>
                </Select>
            )
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: '#000' }}>
            <Sider width={200} theme="dark">
                <Menu
                    mode="inline"
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    style={{ height: '100%', borderRight: 0 }}
                    items={[
                        { key: '1', icon: <DashboardOutlined />, label: 'Overview', onClick: () => setActiveTab("1") },
                        { key: '2', icon: <AppstoreOutlined />, label: 'Products', onClick: () => setActiveTab("2") },
                        { key: '3', icon: <ShoppingOutlined />, label: 'Orders', onClick: () => setActiveTab("3") },
                    ]}
                />
            </Sider>
            <Layout style={{ padding: '0 24px 24px', background: '#121212' }}>
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    {activeTab === "1" && (
                        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                            <Title level={2} style={{ marginBottom: '30px', color: '#fff' }}>Welcome back, {user?.name || 'Admin'}</Title>

                            <Row gutter={[24, 24]}>
                                {stats.map((stat, index) => (
                                    <Col xs={24} sm={12} lg={6} key={index}>
                                        <Card bordered={false} style={{ borderRadius: '12px', background: '#1f1f1f' }}>
                                            <Statistic
                                                title={<Text type="secondary" style={{ color: '#aaa' }}>{stat.title}</Text>}
                                                value={stat.value}
                                                prefix={stat.prefix}
                                                valueStyle={{ color: stat.color, fontWeight: 'bold' }}
                                                suffix={
                                                    <div style={{ float: 'right', opacity: 0.2, fontSize: '24px' }}>
                                                        {stat.icon}
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            <Row gutter={[24, 24]} style={{ marginTop: '30px' }}>
                                <Col xs={24} lg={16}>
                                    <Card title={<Title level={4} style={{ color: '#fff' }}>Recent Sales</Title>} bordered={false} style={{ borderRadius: '12px', minHeight: '400px', background: '#1f1f1f' }}>
                                        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                                            Chart Representation Placeholder
                                        </div>
                                    </Card>
                                </Col>
                                <Col xs={24} lg={8}>
                                    <Card title={<Title level={4} style={{ color: '#fff' }}>Activity Log</Title>} bordered={false} style={{ borderRadius: '12px', minHeight: '400px', background: '#1f1f1f' }}>
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={recentActivity}
                                            renderItem={(item: RecentActivityItem) => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<Avatar icon={<RiseOutlined />} style={{ backgroundColor: '#222' }} />}
                                                        title={<Text strong style={{ color: '#ccc' }}>{item.title}</Text>}
                                                        description={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <Text type="secondary" style={{ fontSize: '12px' }}>{item.desc}</Text>
                                                            <Text type="secondary" style={{ fontSize: '10px' }}>{item.time}</Text>
                                                        </div>}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    )}

                    {activeTab === "2" && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <Title level={2} style={{ color: '#d4af37' }}>Product Management</Title>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsProductModalVisible(true)}>
                                    New Product
                                </Button>
                            </div>
                            <Table dataSource={products} columns={productColumns} rowKey="id" />
                        </div>
                    )}

                    {activeTab === "3" && (
                        <div>
                            <Title level={2} style={{ color: '#d4af37' }}>Order Management</Title>
                            <Table dataSource={orders} columns={orderColumns} rowKey="id" />
                        </div>
                    )}
                </Content>
            </Layout>

            <Modal
                title="Add New Product"
                open={isProductModalVisible}
                onCancel={() => setIsProductModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleAddProduct}>
                    <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} prefix="$" />
                    </Form.Item>
                    <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="image" label="Product Image">
                        <Upload maxCount={1} beforeUpload={() => false} listType="picture">
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading} style={{ marginTop: 20 }}>
                        Add Product
                    </Button>
                </Form>
            </Modal>
        </Layout>
    );
};

export default AdminDashboard;
