import { Carousel, Button, Typography, Spin } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';

const { Title, Paragraph } = Typography;

const heroStyle: React.CSSProperties = {
    height: '800px',
    color: '#fff',
    textAlign: 'center',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center 30%',
    overflow: 'hidden',
};

const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(2,6,23,0.8) 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 20px',
};

interface Banner {
    id: number;
    title: string;
    subtitle: string;
    buttonText: string;
    linkUrl: string;
    imageUrl: string;
}

const Hero = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await api.get('/banners/active');
                setBanners(response.data);
            } catch (err) {
                console.error('Failed to fetch banners', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    if (loading) return <div style={{ height: '800px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#020617' }}><Spin size="large" /></div>;

    const renderEmptyHero = () => (
        <div style={{ ...heroStyle, backgroundImage: 'url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop)' }}>
            <div style={overlayStyle}>
                <div className="fade-in-up">
                    <Title level={1} className="premium-gradient-text" style={{ fontSize: '5rem', marginBottom: '20px', textTransform: 'uppercase' }}>
                        Timeless Luxury
                    </Title>
                    <Paragraph style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '40px', color: '#cbd5e1' }}>
                        Experience the collection that defines modern elegance.
                    </Paragraph>
                    <Link to="/products">
                        <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                            Discover More
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );

    if (banners.length === 0) return renderEmptyHero();

    return (
        <div className="hero-section" style={{ marginBottom: '80px' }}>
            <Carousel autoplay effect="fade" autoplaySpeed={6000}>
                {banners.map((banner) => (
                    <div key={banner.id}>
                        <div style={{ ...heroStyle, backgroundImage: `url(${banner.imageUrl})` }}>
                            <div style={overlayStyle}>
                                <div className="fade-in-up" style={{ textAlign: 'center' }}>
                                    <Title level={1} className="premium-gradient-text" style={{ fontSize: '5.5rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '4px' }}>
                                        {banner.title}
                                    </Title>
                                    <Paragraph style={{ fontSize: '1.5rem', maxWidth: '800px', marginBottom: '45px', color: '#e2e8f0', fontWeight: 300, fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                                        {banner.subtitle}
                                    </Paragraph>
                                    {banner.buttonText && (
                                        <Link to={banner.linkUrl || '/products'}>
                                            <Button type="primary" size="large" icon={<ArrowRightOutlined />} style={{ height: '60px', padding: '0 45px', fontSize: '1.1rem' }}>
                                                {banner.buttonText}
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Hero;
