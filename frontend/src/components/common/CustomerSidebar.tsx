import React, { useState } from 'react';
import { Layout, Menu, Slider, Rate, Typography } from 'antd';
import {
    HomeOutlined,
    ShopOutlined,
    FireOutlined,
    RiseOutlined,
    DollarOutlined,
    UserOutlined,
    HeartOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    AppstoreOutlined,
    ManOutlined,
    WomanOutlined,
    SkinOutlined,
    CustomerServiceOutlined,
    FilterOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Title, Text } = Typography;

const CustomerSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // Theme colors
    const goldColor = '#d4af37';

    // ... menuItems ...

    // (Inside the JSX)
    <div style={{ marginBottom: '20px' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>Price Range</Text>
        <Slider range defaultValue={[20, 500]} max={1000} trackStyle={[{ backgroundColor: goldColor }]} handleStyle={[{ borderColor: goldColor }, { borderColor: goldColor }]} />
    </div>

    const menuItems = [
        {
            key: 'shop',
            icon: <ShopOutlined style={{ color: goldColor }} />,
            label: 'Shop',
            children: [
                { key: '/', icon: <HomeOutlined />, label: 'Home' },
                { key: '/products', icon: <AppstoreOutlined />, label: 'All Products' },
                { key: '/new-arrivals', icon: <FireOutlined />, label: 'New Arrivals' },
                { key: '/best-sellers', icon: <RiseOutlined />, label: 'Best Sellers' },
                { key: '/discounts', icon: <DollarOutlined />, label: 'Discounts' },
            ]
        },
        {
            key: 'categories',
            icon: <AppstoreOutlined style={{ color: goldColor }} />,
            label: 'Categories',
            children: [
                { key: '/category/men', icon: <ManOutlined />, label: 'Men' },
                { key: '/category/women', icon: <WomanOutlined />, label: 'Women' },
                { key: '/category/shoes', icon: <SkinOutlined />, label: 'Shoes' },
                { key: '/category/accessories', icon: <ShoppingOutlined />, label: 'Accessories' },
                { key: '/category/watches', icon: <CustomerServiceOutlined />, label: 'Watches' },
            ]
        },
        {
            key: 'user',
            icon: <UserOutlined style={{ color: goldColor }} />,
            label: 'User Zone',
            children: [
                { key: '/profile', icon: <UserOutlined />, label: 'Profile' },
                { key: '/wishlist', icon: <HeartOutlined />, label: 'Wishlist' },
                { key: '/cart', icon: <ShoppingCartOutlined />, label: 'Cart' },
                { key: '/orders', icon: <ShoppingOutlined />, label: 'My Orders' },
            ]
        }
    ];

    return (
        <Sider
            width={280}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            style={{
                background: '#141414',
                borderRight: '1px solid #333',
                overflow: 'auto',
                height: '100vh',
                position: 'sticky',
                top: 0,
                left: 0,
                zIndex: 100
            }}
            theme="dark"
        >
            <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #333' }}>
                {!collapsed && (
                    <Title level={4} style={{ color: goldColor, margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
                        AS Shop
                    </Title>
                )}
                {collapsed && <ShopOutlined style={{ fontSize: '24px', color: goldColor }} />}
            </div>

            <Menu
                mode="inline"
                defaultSelectedKeys={[location.pathname]}
                defaultOpenKeys={['shop', 'categories', 'user']}
                style={{ background: 'transparent', borderRight: 0 }}
                items={menuItems.map(item => ({
                    key: item.key,
                    icon: item.icon,
                    label: <span style={{ fontWeight: 600 }}>{item.label}</span>,
                    children: item.children?.map(child => ({
                        key: child.key,
                        icon: child.icon,
                        label: child.label,
                        onClick: () => navigate(child.key)
                    }))
                }))}
            />

            {!collapsed && (
                <div style={{ padding: '20px', borderTop: '1px solid #333', marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                        <FilterOutlined style={{ color: goldColor }} />
                        <Text strong style={{ color: '#fff' }}>Quick Filters</Text>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Price Range</Text>
                        <Slider range defaultValue={[20, 500]} max={1000} trackStyle={[{ backgroundColor: goldColor }]} handleStyle={[{ borderColor: goldColor }, { borderColor: goldColor }]} />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Color</Text>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['black', 'white', 'blue', 'red', 'gold'].map(c => (
                                <div key={c} style={{ width: '20px', height: '20px', borderRadius: '50%', background: c === 'gold' ? '#d4af37' : c, border: '1px solid #444', cursor: 'pointer' }} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Rating</Text>
                        <Rate disabled defaultValue={4} style={{ fontSize: '14px', color: goldColor }} />
                    </div>
                </div>
            )}
        </Sider>
    );
};

export default CustomerSidebar;
