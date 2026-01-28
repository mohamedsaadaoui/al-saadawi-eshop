import Navbar from '../components/common/Navbar';
import Hero from '../components/home/Hero';
import ProductGrid from '../components/products/ProductGrid';
import { Layout } from 'antd';

const { Content } = Layout;

const Home = () => {
    return (
        <>
            <Hero />
            <Content style={{ padding: '0 0 50px' }}>
                <ProductGrid />
            </Content>
        </>
    );
};

export default Home;
