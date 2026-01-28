import React, { useState } from 'react';
import { Card, Typography, Button, Tag, Modal, Row, Col } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import { getImageUrl } from '../../services/api';

const { Text, Title, Paragraph } = Typography;

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category?: string;
    description?: string;
    isNew?: boolean;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();
    const { addToRecentlyViewed, toggleWishlist, isWishlisted } = useUserPreferences();
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    const handleQuickView = () => {
        addToRecentlyViewed(product);
        setIsQuickViewOpen(true);
    };

    return (
        <div className="product-card-container">
            <Card
                hoverable
                bordered={false}
                className="premium-product-card"
                style={{
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid var(--border)',
                    transition: 'var(--transition)',
                }}
                cover={
                    <div className="image-container" style={{
                        position: 'relative',
                        overflow: 'hidden',
                        height: '400px',
                        background: '#0a0a0a'
                    }}>
                        {product.isNew && (
                            <Tag style={{
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                zIndex: 3,
                                background: 'var(--primary-gradient)',
                                border: 'none',
                                color: '#000',
                                fontWeight: 700,
                                borderRadius: '4px',
                                padding: '4px 10px',
                                fontSize: '11px'
                            }}>
                                EXCLUSIVE
                            </Tag>
                        )}
                        <img
                            alt={product.name}
                            src={getImageUrl(product.imageUrl)}
                            className="product-image"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        />

                        {/* Quick View & Wishlist */}
                        <div className="action-overlay" style={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            opacity: 0,
                            transform: 'translateX(20px)',
                            transition: 'all 0.4s ease'
                        }}>
                            <Button
                                shape="circle"
                                icon={<EyeOutlined />}
                                onClick={handleQuickView}
                                className="glass-effect"
                                style={{ color: 'white', border: '1px solid var(--border)' }}
                            />
                            <Button
                                shape="circle"
                                icon={isWishlisted(product.id) ? <HeartFilled style={{ color: '#ef4444' }} /> : <HeartOutlined />}
                                onClick={() => toggleWishlist(product.id)}
                                className="glass-effect"
                                style={{ color: isWishlisted(product.id) ? '#ef4444' : 'white', border: '1px solid var(--border)' }}
                            />
                        </div>

                        {/* Add to Cart Overlay */}
                        <div className="cart-overlay" style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                            padding: '30px 20px 20px',
                            transform: 'translateY(100%)',
                            transition: 'transform 0.4s ease',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Button
                                type="primary"
                                block
                                icon={<ShoppingCartOutlined />}
                                onClick={() => addToCart({ ...product, quantity: 1 })}
                            >
                                QUICK ADD
                            </Button>
                        </div>
                    </div>
                }
            >
                <div style={{ textAlign: 'center' }}>
                    <Text style={{
                        fontSize: '11px',
                        color: 'var(--primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600
                    }}>
                        {product.category || 'Collection'}
                    </Text>
                    <Title level={5} style={{
                        margin: '0 0 10px',
                        fontSize: '18px',
                        color: 'white',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 600
                    }}>
                        {product.name}
                    </Title>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        ${product.price.toFixed(2)}
                    </div>
                </div>
            </Card>

            {/* Quick View Modal */}
            <Modal
                open={isQuickViewOpen}
                onCancel={() => setIsQuickViewOpen(false)}
                footer={null}
                width={900}
                centered
            >
                <Row gutter={40} align="middle">
                    <Col md={12}>
                        <img src={getImageUrl(product.imageUrl)} alt={product.name} style={{ width: '100%', borderRadius: '12px' }} />
                    </Col>
                    <Col md={12}>
                        <Title level={2} className="premium-gradient-text" style={{ marginBottom: 10 }}>{product.name}</Title>
                        <Tag color="gold" style={{ marginBottom: 20 }}>{product.category}</Tag>
                        <Title level={3} style={{ color: 'white', marginTop: 0 }}>${product.price.toFixed(2)}</Title>
                        <Paragraph style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.8' }}>
                            {product.description || "Indulge in the finest craftsmanship with this premium selection. A perfect blend of contemporary style and timeless elegance, designed for the modern connoisseur."}
                        </Paragraph>
                        <div style={{ marginTop: 40, display: 'flex', gap: '15px' }}>
                            <Button
                                type="primary"
                                size="large"
                                block
                                icon={<ShoppingCartOutlined />}
                                onClick={() => { addToCart({ ...product, quantity: 1 }); setIsQuickViewOpen(false); }}
                                style={{ height: '55px' }}
                            >
                                ADD TO SHOPPING BAG
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal>

            <style>{`
                .premium-product-card:hover .product-image {
                    transform: scale(1.1);
                }
                .premium-product-card:hover .action-overlay {
                    opacity: 1;
                    transform: translateX(0);
                }
                .premium-product-card:hover .cart-overlay {
                    transform: translateY(0);
                }
                .ant-modal-mask {
                    backdrop-filter: blur(8px);
                }
            `}</style>
        </div>
    );
};

export default ProductCard;
