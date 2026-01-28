import { Layout, Menu, Badge, Dropdown, Drawer, Button, List, Typography } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, SearchOutlined, MenuOutlined, BellOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useState, useEffect } from 'react';
import api from '../../services/api';

const { Text } = Typography;
const { Header } = Layout;

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { itemCount } = useCart();
    const { getSetting } = useStore();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [categories, setCategories] = useState<any[]>([]);

    const storeName = getSetting('store_name') || 'ALSADAWI';

    const fetchInitialData = async () => {
        try {
            const catRes = await api.get('/categories');
            setCategories(catRes.data);
        } catch (err) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchNotifications = async () => {
        if (!isAuthenticated) return;
        try {
            const [notifRes, countRes] = await Promise.all([
                api.get('/notifications'),
                api.get('/notifications/unread-count')
            ]);
            setNotifications(notifRes.data);
            setUnreadCount(countRes.data);
        } catch (err) {
            console.error('Failed to fetch notifications');
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const notificationMenu = (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', width: '320px', maxHeight: '450px', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ color: 'var(--primary)', fontSize: '15px', fontFamily: 'var(--font-serif)' }}>Notifications</Text>
                <Button type="link" size="small" onClick={() => api.put('/notifications/read-all').then(fetchNotifications)} style={{ color: 'var(--text-secondary)' }}>
                    Clear all
                </Button>
            </div>
            <List
                className="premium-scroll"
                style={{ overflowY: 'auto', maxHeight: '380px' }}
                dataSource={notifications}
                renderItem={(item) => (
                    <List.Item
                        style={{ padding: '16px', cursor: 'pointer', background: item.isRead ? 'transparent' : 'rgba(212, 175, 55, 0.05)', borderBottom: '1px solid var(--border)', transition: 'background 0.3s' }}
                        onClick={() => api.put(`/notifications/${item.id}/read`).then(fetchNotifications)}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Text style={{ color: item.isRead ? 'var(--text-secondary)' : 'var(--text-primary)', fontSize: '13px' }}>{item.message}</Text>
                            <Text style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                        </div>
                    </List.Item>
                )}
                locale={{ emptyText: <div style={{ color: 'var(--text-muted)', padding: '30px', textAlign: 'center' }}>No new updates</div> }}
            />
        </div>
    );

    const userMenuGroups = [
        {
            key: 'account',
            label: <Link to="/profile">My Account</Link>,
            icon: <UserOutlined />,
        },
        ...(user?.role === 'ROLE_ADMIN' ? [{
            key: 'admin',
            label: <Link to="/dashboard">Admin Panel</Link>,
            icon: <MenuOutlined />,
        }] : []),
        {
            key: 'logout',
            label: <span onClick={handleLogout}>Log Out</span>,
            icon: <LogoutOutlined />,
            danger: true,
        }
    ];

    const navItems = [
        { key: 'home', label: <Link to="/">HOME</Link> },
        { key: 'products', label: <Link to="/products">SHOP</Link> },
        {
            key: 'categories',
            label: 'COLLECTIONS',
            children: categories.map(c => ({
                key: `cat-${c.id}`,
                label: <Link to={`/category/${c.name.toLowerCase()}`}>{c.name}</Link>
            }))
        }
    ];

    return (
        <Header className="glass-effect" style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 8%',
            height: '80px',
            lineHeight: '80px',
            borderBottom: '1px solid var(--border)'
        }}>
            {/* Logo Section */}
            <div className="logo" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/')}>
                <span className="premium-gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '3px' }}>
                    {storeName}
                </span>
            </div>

            {/* Desktop Center Menu */}
            <div className="desktop-menu" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Menu
                    mode="horizontal"
                    items={navItems}
                    style={{ border: 'none', minWidth: '400px', display: 'flex', justifyContent: 'center' }}
                />
            </div>

            {/* Icons / Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px', flexShrink: 0 }}>
                <SearchOutlined style={{ fontSize: '20px', color: 'var(--text-primary)', cursor: 'pointer' }} />

                {isAuthenticated && (
                    <Dropdown dropdownRender={() => notificationMenu} trigger={['click']} placement="bottomRight">
                        <Badge count={unreadCount} size="small" color="#d4af37">
                            <BellOutlined style={{ fontSize: '20px', color: 'var(--text-primary)', cursor: 'pointer' }} />
                        </Badge>
                    </Dropdown>
                )}

                {isAuthenticated ? (
                    <Dropdown menu={{ items: userMenuGroups }} placement="bottomRight">
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'white' }}>
                            <UserOutlined style={{ fontSize: '20px' }} />
                        </div>
                    </Dropdown>
                ) : (
                    <Link to="/login" style={{ color: 'white', fontSize: '13px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>
                        Join Us
                    </Link>
                )}

                <Link to="/cart">
                    <Badge count={itemCount} offset={[0, 0]} size="small" color="#d4af37">
                        <ShoppingCartOutlined style={{ fontSize: '22px', color: 'white' }} />
                    </Badge>
                </Link>

                <Button className="mobile-menu-btn" icon={<MenuOutlined />} type="text" style={{ display: 'none', color: 'white' }} onClick={() => setMobileMenuOpen(true)} />
            </div>

            {/* Mobile Drawer */}
            <Drawer
                title={<span className="premium-gradient-text">EXPLORE</span>}
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                styles={{ body: { backgroundColor: 'var(--bg-deep)', padding: 0 }, header: { backgroundColor: 'var(--bg-deep)', borderBottom: '1px solid var(--border)' } }}
            >
                <Menu
                    mode="vertical"
                    items={navItems}
                    style={{ background: 'transparent', border: 'none' }}
                    onClick={() => setMobileMenuOpen(false)}
                />
            </Drawer>

            <style>{`
                @media (max-width: 992px) {
                    .desktop-menu { display: none !important; }
                    .mobile-menu-btn { display: block !important; }
                    .logo { font-size: 1.4rem; }
                }
                .ant-menu-horizontal {
                    line-height: 80px;
                }
            `}</style>
        </Header>
    );
};

export default Navbar;
