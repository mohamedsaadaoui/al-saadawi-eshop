import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, message, Card, Typography, Space, Divider } from 'antd';
import { ArrowLeftOutlined, LinkOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AdminProductForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    const fetchProduct = async (productId: string) => {
        try {
            const res = await api.get(`/products/${productId}`);
            form.setFieldsValue(res.data);
            setPreviewUrl(res.data.imageUrl || '');
        } catch (err) {
            message.error('Failed to fetch product details');
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);

        // We still use FormData because the backend expects @RequestParam (multipart form data)
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price.toString());
        formData.append('stock', values.stock.toString());
        if (values.imageUrl) {
            formData.append('imageUrl', values.imageUrl);
        }

        try {
            if (id) {
                // For update, the current backend implementation might take JSON or parameters
                // Keeping it simple as per previous working logic
                await api.put(`/products/${id}`, values);
                message.success('Product updated successfully');
            } else {
                await api.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                message.success('Product created successfully');
            }
            navigate('/admin/products');
        } catch (err) {
            message.error('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '40px auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/admin/products')}
                    style={{ color: 'var(--text-secondary)' }}
                >
                    Back to Catalog
                </Button>

                <Card className="glass-effect" style={{ border: '1px solid var(--border)', borderRadius: '16px' }}>
                    <Title level={3} className="premium-gradient-text" style={{ marginBottom: '30px' }}>
                        {id ? 'Refine Product' : 'Register New Product'}
                    </Title>

                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Please enter a name' }]}>
                            <Input placeholder="e.g. Signature Silk Scarf" />
                        </Form.Item>

                        <Form.Item name="description" label="Detailed Description" rules={[{ required: true }]}>
                            <TextArea rows={4} placeholder="Describe the craftsmanship and materials..." />
                        </Form.Item>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Form.Item name="price" label="Market Price" rules={[{ required: true }]} style={{ flex: 1 }}>
                                <InputNumber style={{ width: '100%' }} prefix="$" min={0} />
                            </Form.Item>
                            <Form.Item name="stock" label="Inventory Count" rules={[{ required: true }]} style={{ flex: 1 }}>
                                <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                        </div>

                        <Divider style={{ borderColor: 'var(--border)' }} />

                        <Form.Item
                            name="imageUrl"
                            label="Remote Image URL"
                            rules={[{ required: true, message: 'Image URL is required' }]}
                            extra={<Text type="secondary" style={{ fontSize: '11px' }}>Provide a high-quality URL (CDN, Unsplash, etc.)</Text>}
                        >
                            <Input
                                prefix={<LinkOutlined style={{ color: 'var(--primary)' }} />}
                                placeholder="https://images.unsplash.com/..."
                                onChange={(e) => setPreviewUrl(e.target.value)}
                            />
                        </Form.Item>

                        {previewUrl && (
                            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                                <Text style={{ display: 'block', marginBottom: '10px', fontSize: '12px' }}>Visual Preview:</Text>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        height: '240px',
                                        borderRadius: '12px',
                                        objectFit: 'cover',
                                        border: '1px solid var(--border)'
                                    }}
                                    onError={() => setPreviewUrl('')}
                                />
                            </div>
                        )}

                        <Form.Item style={{ marginTop: '40px' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                size="large"
                                style={{ height: '55px', fontSize: '1.1rem' }}
                            >
                                {id ? 'Save Changes' : 'Publish Product'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Space>
        </div>
    );
};

export default AdminProductForm;
