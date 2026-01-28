import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Button, Rate, Spin, Divider, Tag } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useUserPreferences } from '../context/UserPreferencesContext';

const { Title, Text, Paragraph } = Typography;

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category?: string;
    description?: string;
    stock?: number;
}

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { toggleWishlist, isWishlisted } = useUserPreferences();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error("Failed to fetch product", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" /></div>;
    if (!product) return <div style={{ textAlign: 'center', padding: '100px' }}><Title level={3}>Product not found</Title></div>;

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: '20px', border: 'none', background: 'transparent', color: '#888' }}
            >
                Back to Shopping
            </Button>

            <Row gutter={[40, 40]}>
                {/* Image Section */}
                <Col xs={24} md={12}>
                    <div style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        background: '#1a1a1a'
                    }}>
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{ width: '100%', display: 'block' }}
                        />
                    </div>
                </Col>

                {/* Details Section */}
                <Col xs={24} md={12}>
                    <div style={{ paddingLeft: '20px' }}>
                        <Tag color="#d4af37" style={{ marginBottom: '10px' }}>{product.category || 'Premium Collection'}</Tag>

                        <Title level={1} style={{ marginTop: '5px', marginBottom: '10px', fontSize: '3rem' }}>
                            {product.name}
                        </Title>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                            <Rate disabled defaultValue={5} style={{ color: '#d4af37' }} />
                            <Text type="secondary">(12 Reviews)</Text>
                        </div>

                        <Title level={2} style={{ color: '#d4af37', marginTop: 0, marginBottom: '20px' }}>
                            ${product.price.toFixed(2)}
                        </Title>

                        <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#ccc', marginBottom: '30px' }}>
                            {product.description || "Indulge in the finest quality with this exclusive piece. Designed for the modern individual who values elegance and sophistication."}
                        </Paragraph>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                            <Button
                                type="primary"
                                size="large"
                                icon={<ShoppingCartOutlined />}
                                onClick={() => addToCart({ ...product, quantity: 1 })}
                                style={{
                                    height: '50px',
                                    padding: '0 40px',
                                    fontSize: '18px',
                                    background: 'linear-gradient(45deg, #d4af37, #f3e5ab)',
                                    borderColor: '#d4af37',
                                    color: '#000'
                                }}
                            >
                                Add to Cart
                            </Button>

                            <Button
                                size="large"
                                icon={isWishlisted(product.id) ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                                onClick={() => product.id && toggleWishlist(product.id)}
                                style={{ height: '50px', width: '50px' }}
                            />
                        </div>

                        <Divider style={{ borderColor: '#333' }} />

                        <Row gutter={[20, 20]} style={{ marginTop: '20px' }}>
                            <Col span={8}>
                                <Text type="secondary" style={{ display: 'block' }}>Availability</Text>
                                <Text strong style={{ color: '#52c41a' }}>In Stock</Text>
                            </Col>
                            <Col span={8}>
                                <Text type="secondary" style={{ display: 'block' }}>SKU</Text>
                                <Text>AL-{product.id}-X</Text>
                            </Col>
                            <Col span={8}>
                                <Text type="secondary" style={{ display: 'block' }}>Delivery</Text>
                                <Text>2-4 Days</Text>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetail;
