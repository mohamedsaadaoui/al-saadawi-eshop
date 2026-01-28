import React, { useState } from 'react';
import { Layout, Menu, Typography, Modal } from 'antd';
import {
    DashboardOutlined,
    AppstoreOutlined,
    ShoppingOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    PictureOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import type { MenuProps } from 'antd';

const { Sider } = Layout;
const { Title } = Typography;

const AdminSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { getSetting } = useStore();
    const [collapsed, setCollapsed] = useState(false);

    const storeName = getSetting('store_name') || 'Admin Panel';

    const handleLogout = () => {
        Modal.confirm({
            title: 'Confirm Logout',
            content: 'Are you sure you want to log out from the Admin Dashboard?',
            onOk: () => {
                logout();
                navigate('/login');
            }
        });
    };

    const items: MenuProps['items'] = [
        { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        {
            label: 'Catalog',
            key: 'catalog',
            icon: <AppstoreOutlined />,
            children: [
                { key: '/admin/products', label: 'Products' },
                { key: '/admin/products/add', label: 'New Product' },
                { key: '/admin/categories', label: 'Categories' },
                { key: '/admin/brands', label: 'Brands' },
            ]
        },
        { key: '/admin/orders', icon: <ShoppingOutlined />, label: 'Orders' },
        { key: '/admin/users', icon: <UserOutlined />, label: 'Users' },
        { key: '/admin/banners', icon: <PictureOutlined />, label: 'Site Banners' },
        { key: '/admin/settings', icon: <SettingOutlined />, label: 'Store Settings' },
        { type: 'divider' },
        { key: 'logout', icon: <LogoutOutlined />, label: 'Exit Dashboard', danger: true },
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'logout') {
            handleLogout();
        } else {
            navigate(e.key);
        }
    };

    return (
        <Sider
            width={280}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            className="glass-effect"
            style={{
                borderRight: '1px solid var(--border)',
                height: '100vh',
                position: 'sticky',
                top: 0,
                left: 0,
            }}
        >
            <div style={{ padding: '32px 24px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
                {!collapsed ? (
                    <div>
                        <Title level={4} className="premium-gradient-text" style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '2px' }}>
                            {storeName}
                        </Title>
                        <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Control Center
                        </div>
                    </div>
                ) : (
                    <DashboardOutlined style={{ fontSize: '24px', color: 'var(--primary)' }} />
                )}
            </div>

            <Menu
                mode="inline"
                theme="dark"
                selectedKeys={[location.pathname]}
                defaultOpenKeys={['catalog']}
                style={{ background: 'transparent', borderRight: 0, marginTop: '20px', padding: '0 10px' }}
                onClick={onClick}
                items={items}
            />
        </Sider>
    );
};

export default AdminSidebar;
