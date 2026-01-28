import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, message, Typography, Card } from 'antd';
import api from '../../services/api';

const { Title } = Typography;
const { Option } = Select;

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/orders');
            setOrders(res.data);
        } catch (err) {
            message.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: number, status: string) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status });
            message.success('Order status updated');
            fetchOrders();
        } catch (err) {
            message.error('Failed to update status');
        }
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (id: number) => <b>#{id}</b>
        },
        {
            title: 'Customer',
            dataIndex: 'user',
            key: 'user',
            render: (user: any, record: any) => user ? user.email : (record.items && record.items.length > 0 ? 'Guest' : 'Unknown') // Improved fallback
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => `$${amount ? amount.toFixed(2) : '0.00'}`
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: any) => (
                <Select
                    defaultValue={status}
                    style={{ width: 120 }}
                    onChange={(val) => handleStatusChange(record.id, val)}
                    bordered={false}
                    className="status-select"
                >
                    <Option value="PENDING"><Tag color="orange">PENDING</Tag></Option>
                    <Option value="SHIPPED"><Tag color="blue">SHIPPED</Tag></Option>
                    <Option value="DELIVERED"><Tag color="green">DELIVERED</Tag></Option>
                    <Option value="CANCELLED"><Tag color="red">CANCELLED</Tag></Option>
                </Select>
            )
        },
        {
            title: 'Date',
            dataIndex: 'orderDate', // Assuming backend has this, or createdAt
            key: 'date',
            render: (date: any) => date ? new Date(date).toLocaleDateString() : '-'
        }
    ];

    return (
        <div>
            <Title level={2} style={{ marginBottom: 20 }}>Order Management</Title>
            <Card bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default AdminOrders;
