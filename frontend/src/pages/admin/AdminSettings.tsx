import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message, Row, Col, Switch } from 'antd';
import { SettingOutlined, SaveOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title } = Typography;

const AdminSettings: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/settings');
            const settingsMap: any = {};
            response.data.forEach((s: any) => {
                settingsMap[s.settingKey] = s.settingValue;
            });
            form.setFieldsValue(settingsMap);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            for (const key in values) {
                await api.post('/settings', { key, value: String(values[key]) });
            }
            message.success('Settings saved successfully');
        } catch (err) {
            message.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Title level={3} style={{ color: '#fff', marginBottom: '24px' }}>
                <SettingOutlined /> Store Settings
            </Title>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Card style={{ background: '#0F172A', border: '1px solid #1e293b', borderRadius: '12px' }}>
                    <Title level={5} style={{ color: '#d4af37' }}>General Information</Title>
                    <Divider style={{ borderColor: '#1e293b', marginTop: 8 }} />

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name="store_name" label={<span style={{ color: '#ccc' }}>Store Name</span>}>
                                <Input placeholder="E-SHOP Premium" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="store_email" label={<span style={{ color: '#ccc' }}>Contact Email</span>}>
                                <Input placeholder="contact@eshop.com" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="store_description" label={<span style={{ color: '#ccc' }}>Store Description</span>}>
                        <Input.TextArea placeholder="A premium shopping experience" rows={4} />
                    </Form.Item>

                    <Title level={5} style={{ color: '#d4af37', marginTop: 24 }}>Currency & Regional</Title>
                    <Divider style={{ borderColor: '#1e293b', marginTop: 8 }} />

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name="currency" label={<span style={{ color: '#ccc' }}>Primary Currency</span>}>
                                <Input placeholder="USD ($)" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="maintenance_mode" label={<span style={{ color: '#ccc' }}>Maintenance Mode</span>} valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ marginTop: 32, textAlign: 'right' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={loading}
                            style={{ background: 'linear-gradient(135deg, #d4af37 0%, #e5c158 100%)', border: 'none', height: '45px', padding: '0 30px' }}
                        >
                            Save Settings
                        </Button>
                    </div>
                </Card>
            </Form>
        </div>
    );
};

export default AdminSettings;
