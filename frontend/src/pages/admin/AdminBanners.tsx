import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, Input, Modal, Form, message, Switch, Image, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title } = Typography;

interface Banner {
    id: number;
    title: string;
    subtitle: string;
    buttonText: string;
    linkUrl: string;
    imageUrl: string;
    active: boolean;
}

const AdminBanners: React.FC = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [form] = Form.useForm();

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const response = await api.get('/banners');
            setBanners(response.data);
        } catch (err) {
            message.error('Failed to fetch banners');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const showModal = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            form.setFieldsValue(banner);
        } else {
            setEditingBanner(null);
            form.resetFields();
            form.setFieldsValue({ active: true });
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = editingBanner ? { ...editingBanner, ...values } : values;
            await api.post('/banners', payload);
            message.success(editingBanner ? 'Banner updated' : 'Banner created');
            setIsModalVisible(false);
            fetchBanners();
        } catch (err) {
            message.error('Operation failed');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/banners/${id}`);
            message.success('Banner deleted');
            fetchBanners();
        } catch (err) {
            message.error('Failed to delete banner');
        }
    };

    const columns = [
        {
            title: 'Preview',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (url: string) => <Image src={url} width={100} style={{ borderRadius: '4px', objectFit: 'cover' }} />
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <span style={{ fontWeight: 'bold', color: '#d4af37' }}>{text}</span>
        },
        {
            title: 'Status',
            dataIndex: 'active',
            key: 'active',
            render: (active: boolean) => <Switch checked={active} disabled />
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Banner) => (
                <Space>
                    <Button type="text" style={{ color: '#d4af37' }} icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    return (
        <Card style={{ background: '#0F172A', border: '1px solid #1e293b', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={3} style={{ color: '#fff', margin: 0 }}>Homepage Banners</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                    style={{ background: 'linear-gradient(135deg, #d4af37 0%, #e5c158 100%)', border: 'none' }}
                >
                    Add Banner
                </Button>
            </div>

            <Table
                loading={loading}
                dataSource={banners}
                columns={columns}
                rowKey="id"
                style={{ background: 'transparent' }}
                className="premium-table"
            />

            <Modal
                title={editingBanner ? 'Edit Banner' : 'New Banner'}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Save"
                cancelText="Cancel"
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="title" label="Main Title" rules={[{ required: true }]}>
                                <Input placeholder="e.g. Winter Collection" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="subtitle" label="Subtitle">
                                <Input placeholder="e.g. 50% Off all items" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="buttonText" label="Button Text">
                                <Input placeholder="e.g. Shop Now" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="linkUrl" label="Link URL">
                                <Input placeholder="e.g. /products" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="imageUrl" label="Image URL" rules={[{ required: true }]}>
                        <Input prefix={<PictureOutlined />} placeholder="https://..." />
                    </Form.Item>
                    <Form.Item name="active" label="Is Active" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default AdminBanners;
