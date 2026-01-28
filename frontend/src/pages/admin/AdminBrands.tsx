import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, Input, Modal, Form, message, Image, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, ShopOutlined, LinkOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title, Text } = Typography;

interface Brand {
    id: number;
    name: string;
    logoUrl: string;
    description: string;
}

const AdminBrands: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [form] = Form.useForm();

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const response = await api.get('/brands');
            setBrands(response.data);
        } catch (err) {
            message.error('Failed to fetch brands');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const showModal = (brand?: Brand) => {
        if (brand) {
            setEditingBrand(brand);
            form.setFieldsValue(brand);
        } else {
            setEditingBrand(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await api.post('/brands', editingBrand ? { ...editingBrand, ...values } : values);
            message.success(editingBrand ? 'Brand criteria updated' : 'New brand registered');
            setIsModalVisible(false);
            fetchBrands();
        } catch (err) {
            message.error('Operation failed');
        }
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Delete Brand',
            content: 'Removing this brand will disconnect it from all associated products. Continue?',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await api.delete(`/brands/${id}`);
                    message.success('Brand removed');
                    fetchBrands();
                } catch (err) {
                    message.error('Failed to delete brand');
                }
            }
        });
    };

    const columns = [
        {
            title: 'Identity',
            dataIndex: 'logoUrl',
            key: 'logoUrl',
            width: 120,
            render: (url: string) => (
                <div style={{ background: 'white', padding: '4px', borderRadius: '4px', display: 'inline-block' }}>
                    {url ? <Image src={url} width={40} height={40} style={{ objectFit: 'contain' }} /> : <ShopOutlined style={{ fontSize: '24px', color: '#000' }} />}
                </div>
            )
        },
        {
            title: 'Manufacturer / Brand',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong style={{ color: 'white', fontSize: '15px' }}>{text}</Text>
        },
        {
            title: 'Heritage & Details',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => <Text style={{ color: 'var(--text-muted)' }}>{text || 'Legacy brand information'}</Text>
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right' as const,
            render: (_: any, record: Brand) => (
                <Space>
                    <Button type="text" style={{ color: 'var(--primary)' }} icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    return (
        <Card className="glass-effect" style={{ border: '1px solid var(--border)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <Space direction="vertical" size={2}>
                    <Title level={2} className="premium-gradient-text" style={{ margin: 0 }}>Brand Portfolio</Title>
                    <Text type="secondary">Manage the prestigious labels in your collection.</Text>
                </Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                    style={{ height: '45px', padding: '0 25px' }}
                >
                    Register Brand
                </Button>
            </div>

            <Divider style={{ borderColor: 'var(--border)', margin: '0 0 24px' }} />

            <Table
                loading={loading}
                dataSource={brands}
                columns={columns}
                rowKey="id"
                className="premium-table"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingBrand ? 'Refine Brand Details' : 'New Brand Identity'}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Save Brand"
                cancelText="Cancel"
                centered
            >
                <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
                    <Form.Item name="name" label="Official Name" rules={[{ required: true, message: 'Brand name is essential' }]}>
                        <Input placeholder="e.g. Balenciaga, Rolex, etc." />
                    </Form.Item>
                    <Form.Item name="logoUrl" label="Logo Asset (Remote URL)">
                        <Input prefix={<LinkOutlined />} placeholder="https://..." />
                    </Form.Item>
                    <Form.Item name="description" label="Brand Heritage">
                        <Input.TextArea placeholder="A brief about the brand's luxury status..." rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default AdminBrands;
