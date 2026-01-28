import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, message, Typography, Card, Image, Tag, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            message.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Delete Product',
            content: 'Are you sure you want to permanently remove this product from the catalog?',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await api.delete(`/products/${id}`);
                    message.success('Product deleted successfully');
                    fetchProducts();
                } catch (err) {
                    message.error('Failed to delete product');
                }
            }
        });
    };

    const columns = [
        {
            title: 'Visual',
            dataIndex: 'imageUrl',
            key: 'image',
            width: 100,
            render: (url: string) => (
                <Image
                    src={url}
                    width={64}
                    height={64}
                    style={{
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-deep)'
                    }}
                    fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzAyMDYxNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNENEFGMzciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="
                />
            )
        },
        {
            title: 'Product Information',
            key: 'info',
            render: (_: any, record: any) => (
                <div style={{ padding: '4px 0' }}>
                    <Text strong style={{ color: 'white', display: 'block', fontSize: '15px' }}>{record.name}</Text>
                    <Tag style={{ marginTop: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                        {record.category || 'Standard'}
                    </Tag>
                </div>
            )
        },
        {
            title: 'Valuation',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => (
                <Text strong style={{ color: 'var(--primary)', fontSize: '16px' }}>
                    ${price?.toFixed(2)}
                </Text>
            )
        },
        {
            title: 'Inventory',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock: number) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stock > 5 ? 'var(--success)' : 'var(--error)' }} />
                    <Text style={{ color: 'white' }}>{stock} Units</Text>
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'action',
            align: 'right' as const,
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/products/edit/${record.id}`)}
                        style={{ color: 'var(--primary)' }}
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <Card className="glass-effect" style={{ border: '1px solid var(--border)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <Space direction="vertical" size={2}>
                    <Title level={2} className="premium-gradient-text" style={{ margin: 0 }}>Catalog Inventory</Title>
                    <Text type="secondary">Manage and update your luxury product portfolio.</Text>
                </Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/admin/products/add')}
                    style={{ height: '45px', padding: '0 25px' }}
                >
                    Add Prestige Item
                </Button>
            </div>

            <Divider style={{ borderColor: 'var(--border)', margin: '0 0 24px' }} />

            <Table
                columns={columns}
                dataSource={products}
                rowKey="id"
                loading={loading}
                className="premium-table"
                pagination={{ pageSize: 8 }}
            />
        </Card>
    );
};

export default AdminProducts;
