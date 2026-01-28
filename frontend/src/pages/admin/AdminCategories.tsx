import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, Input, Modal, Form, message, Tag, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, TagsOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title, Text } = Typography;

interface Category {
    id: number;
    name: string;
    description: string;
}

const AdminCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [form] = Form.useForm();

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err) {
            message.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const showModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            form.setFieldsValue(category);
        } else {
            setEditingCategory(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await api.post('/categories', editingCategory ? { ...editingCategory, ...values } : values);
            message.success(editingCategory ? 'Category updated' : 'Category created');
            setIsModalVisible(false);
            fetchCategories();
        } catch (err) {
            message.error('Operation failed');
        }
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Delete Category',
            content: 'Deleting this category may affect products linked to it. Proceed?',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await api.delete(`/categories/${id}`);
                    message.success('Category removed');
                    fetchCategories();
                } catch (err) {
                    message.error('Failed to delete category');
                }
            }
        });
    };

    const columns = [
        {
            title: 'Collection Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => (
                <Space>
                    <TagsOutlined style={{ color: 'var(--primary)' }} />
                    <Text strong style={{ color: 'white' }}>{name}</Text>
                </Space>
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (desc: string) => <Text style={{ color: 'var(--text-muted)' }}>{desc || 'No description provided'}</Text>
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right' as const,
            render: (_: any, record: Category) => (
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
                    <Title level={2} className="premium-gradient-text" style={{ margin: 0 }}>Category Management</Title>
                    <Text type="secondary">Organize your catalog into distinct luxury collections.</Text>
                </Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                    style={{ height: '45px', padding: '0 25px' }}
                >
                    Create Collection
                </Button>
            </div>

            <Divider style={{ borderColor: 'var(--border)', margin: '0 0 24px' }} />

            <Table
                loading={loading}
                dataSource={categories}
                columns={columns}
                rowKey="id"
                pagination={false}
                className="premium-table"
            />

            <Modal
                title={editingCategory ? 'Refine Category' : 'New Collection'}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Save Changes"
                cancelText="Cancel"
                width={500}
                centered
            >
                <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
                    <Form.Item name="name" label="Collection Name" rules={[{ required: true, message: 'Please enter a name' }]}>
                        <Input placeholder="e.g. Autumn/Winter 2024" />
                    </Form.Item>
                    <Form.Item name="description" label="Short Description">
                        <Input.TextArea placeholder="Describe the essence of this collection..." rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default AdminCategories;
