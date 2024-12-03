import React, { useEffect, useState } from 'react';
import { Button, Table, Typography, Modal, Form, Input, message, Tag, Space, Popconfirm } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { getTeacherClasses, addTeacherClass, updateTeacherClass, deleteTeacherClass } from '@/service/teacher/mange/classes';
import {
    TeamOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    CalendarOutlined,
    SearchOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from './index.less';
import { ClassFormModal } from './modal';

const { Title, Text } = Typography;


const Classes: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingClass, setEditingClass] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // 获取班级列表
    const { data, loading, refresh } = useRequest(
        async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return getTeacherClasses({
                search: searchText,
                page: currentPage,
                page_size: pageSize
            });
        },
        {
            refreshDeps: [currentPage, searchText],
            debounceWait: 300
        }
    );
    const classes = data?.data || {};

    // 删除班级
    const { run: deleteClass } = useRequest(deleteTeacherClass, {
        manual: true,
        onSuccess: (res: any) => {
            if (res.code === 200) {
                message.success('删除成功');
                refresh();
            }
        }
    });

    const columns = [
        {
            title: '班级名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
                <Space>
                    <TeamOutlined className={styles.columnIcon} />
                    <Text strong>{text}</Text>
                </Space>
            )
        },
        {
            title: '学生人数',
            dataIndex: 'student_count',
            key: 'student_count',
            width: 120,
            render: (count: number) => (
                <Tag color="blue" className={styles.countTag}>
                    {count} 人
                </Tag>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 200,
            render: (date: string) => (
                <Space>
                    <CalendarOutlined className={styles.columnIcon} />
                    <Text type="secondary">
                        {dayjs(date).format('YYYY-MM-DD HH:mm')}
                    </Text>
                </Space>
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingClass(record);
                            setModalVisible(true);
                        }}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="删除班级"
                        description={
                            <div>
                                确定要删除班级 <Text strong>{record.name}</Text> 吗？
                                <br />
                                <Text type="secondary">此操作不可恢复</Text>
                            </div>
                        }
                        onConfirm={() => deleteClass(record.id)}
                        okText="删除"
                        cancelText="取消"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    // 监听刷新事件
    useEffect(() => {
        const handleRefresh = () => {
            refresh();
        };

        window.addEventListener('refreshClasses', handleRefresh);
        return () => {
            window.removeEventListener('refreshClasses', handleRefresh);
        };
    }, [refresh]);

    return (
        <div className={styles.container}>
            <ProCard
                className={styles.tableCard}
                title={
                    <Space className={styles.cardHeader}>
                        <Title level={4} style={{ marginBottom: 0 }}>班级管理</Title>
                        <Input
                            placeholder="搜索班级名称"
                            prefix={<SearchOutlined />}
                            allowClear
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 200 }}
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setEditingClass(null);
                                setModalVisible(true);
                            }}
                        >
                            添加
                        </Button>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={classes.results}
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: classes.count,
                        onChange: (page) => setCurrentPage(page),
                        showTotal: (total) => `共 ${total} 条班级`
                    }}
                    rowKey="id"
                    className={styles.table}
                />
            </ProCard>

            <ClassFormModal
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingClass(null);
                }}
                onSuccess={() => {
                    setModalVisible(false);
                    setEditingClass(null);
                    refresh();
                }}
                initialValues={editingClass}
                title={editingClass ? '编辑班级' : '添加班级'}
            />
        </div>
    );
};

export default Classes;