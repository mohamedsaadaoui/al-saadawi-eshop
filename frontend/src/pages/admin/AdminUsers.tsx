import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, message, Modal, Select } from 'antd';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title } = Typography;
const { Option } = Select;

interface User {
    id: number;
    fullName: string;
    email: string;
    role: 'ROLE_USER' | 'ROLE_ADMIN';
}

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (err) {
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (id: number, newRole: string) => {
        try {
            await api.put(`/admin/users/${id}/role`, { role: newRole });
            message.success('User role updated successfully');
            fetchUsers();
        } catch (err) {
            message.error('Failed to update user role');
        }
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Are you sure?',
            content: 'This will permanently delete the user.',
            okText: 'Yes, Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await api.delete(`/admin/users/${id}`);
                    message.success('User deleted successfully');
                    fetchUsers();
                } catch (err) {
                    message.error('Failed to delete user');
                }
            }
        });
    };

    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text: string) => <Space><UserOutlined style={{ color: '#d4af37' }} /> {text}</Space>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string, record: User) => (
                <Select
                    defaultValue={role}
                    style={{ width: 120 }}
                    onChange={(value) => handleRoleChange(record.id, value)}
                >
                    <Option value="ROLE_USER">User</Option>
                    <Option value="ROLE_ADMIN">Admin</Option>
                </Select>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: User) => (
                <Space>
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            )
        }
    ];

    return (
        <Card style={{ background: '#0F172A', border: '1px solid #1e293b', borderRadius: '12px' }}>
            <Title level={3} style={{ color: '#fff', marginBottom: '24px' }}>User Management</Title>
            <Table
                loading={loading}
                dataSource={users}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                style={{ background: 'transparent' }}
                className="premium-table"
            />
        </Card>
    );
};

export default AdminUsers;
