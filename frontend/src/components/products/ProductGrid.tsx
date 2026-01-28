import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Spin, Input, Select, Drawer, Button, Divider } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../../services/api';
import ProductCard from './ProductCard';
import { useUserPreferences } from '../../context/UserPreferencesContext';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category?: string;
    description?: string;
}

const ProductGrid = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [priceSort, setPriceSort] = useState<string | null>(null);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const { recentlyViewed } = useUserPreferences();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (query?: string) => {
        try {
            setLoading(true);
            const endpoint = query ? `/products/search?query=${query}` : '/products';
            const res = await api.get(endpoint);
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
        return matchesCategory;
    }).sort((a, b) => {
        if (priceSort === 'asc') return a.price - b.price;
        if (priceSort === 'desc') return b.price - a.price;
        return 0;
    });

    const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

    if (loading) return <div style={{ textAlign: 'center', padding: '150px' }}><Spin size="large" /></div>;

    return (
        <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px' }}>

            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                <Title level={1} style={{ fontSize: '3.5rem', marginBottom: '15px' }}>Executive Collections</Title>
                <Paragraph style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    Carefully curated selections for the discerning individual. Discover luxury in every detail.
                </Paragraph>
                <Divider style={{ borderColor: 'var(--border)', width: '100px', minWidth: '100px', margin: '30px auto' }} />
            </div>

            {/* Search & Filter Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', flexWrap: 'wrap', gap: '30px' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <Search
                        placeholder="Search our catalog..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        onSearch={(value) => fetchProducts(value)}
                        className="glass-effect"
                        style={{ maxWidth: '600px', borderRadius: '12px' }}
                    />
                </div>

                <Button
                    icon={<FilterOutlined />}
                    onClick={() => setIsFilterVisible(true)}
                    style={{ height: '50px', padding: '0 30px', borderRadius: '12px' }}
                    className="glass-effect"
                >
                    Filters & Sorting
                </Button>
            </div>

            {/* Filter Drawer */}
            <Drawer
                title={<span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Preferences</span>}
                placement="right"
                onClose={() => setIsFilterVisible(false)}
                open={isFilterVisible}
                styles={{ body: { background: 'var(--bg-deep)' }, header: { background: 'var(--bg-deep)', borderBottom: '1px solid var(--border)' } }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px 0' }}>
                    <div>
                        <Text strong style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Sort By Price</Text>
                        <Select style={{ width: '100%', marginTop: '15px' }} onChange={setPriceSort} placeholder="Choose order" allowClear>
                            <Option value="asc">Low to High</Option>
                            <Option value="desc">High to Low</Option>
                        </Select>
                    </div>
                    <div>
                        <Text strong style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</Text>
                        <Select style={{ width: '100%', marginTop: '15px' }} onChange={setCategoryFilter} placeholder="Select collection" allowClear>
                            {uniqueCategories.map(c => <Option key={c} value={c}>{c}</Option>)}
                        </Select>
                    </div>
                </div>
            </Drawer>

            {/* Main Grid */}
            <Row gutter={[40, 60]}>
                {filteredProducts.map(product => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>

            {/* Recently Viewed Section */}
            {recentlyViewed.length > 0 && (
                <div style={{ marginTop: '150px', borderTop: '1px solid var(--border)', paddingTop: '80px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <Title level={2} style={{ fontSize: '2.5rem' }}>Tailored for You</Title>
                        <Text style={{ color: 'var(--text-muted)' }}>Products you recently expressed interest in.</Text>
                    </div>
                    <Row gutter={[30, 30]}>
                        {recentlyViewed.slice(0, 6).map(product => (
                            <Col xs={12} sm={8} md={6} lg={4} key={product.id}>
                                <div className="ant-card" style={{ padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: '8px', marginBottom: '15px', height: '180px', objectFit: 'cover' }} />
                                    <Text strong style={{ display: 'block', marginBottom: '5px' }}>{product.name}</Text>
                                    <Text type="secondary" style={{ color: 'var(--primary)' }}>${product.price.toFixed(2)}</Text>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;
