import React, { useEffect, useState, useMemo } from "react"
import { Avatar, message, Space, Table, TablePaginationConfig, Tag, Card, Row, Col, Statistic, Button, Typography, Badge, Form, Input, Select } from 'antd';
import { ProCard } from "@ant-design/pro-components";
import { useAntdTable, useRequest } from "ahooks";
import { fetchClasses } from "@/service/student/classes";
import { employmentStatusMap, getStatusColor, provinceMap } from "@/utils/utils";
import BasicForm from "@/components/BasicForm";
import { FormField } from "@/components/BasicForm/types";
import { ColumnType } from "antd/es/table";
import { UserOutlined, IdcardOutlined, EnvironmentOutlined, TeamOutlined, RiseOutlined, AimOutlined, ReloadOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import styles from './index.less';
import { BASE_URL } from "@/config";

const { Text, Title } = Typography;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

// itemVariants 定义子元素的动画状态
const itemVariants = {
    // 初始状态：透明且向下偏移20px
    hidden: { opacity: 0, y: 20 },
    // 显示状态：完全显示且回到原位
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5 // 动画持续0.5秒
        }
    }
};

const Classes: React.FC = () => {
    const [form] = Form.useForm();

    const { tableProps, search, refresh } = useAntdTable(
        (params: { current: number; pageSize: number }, formData: { modelName?: string }
        ) => {
            return fetchClasses({
                ...params,
                ...formData
            });
        },
        {
            defaultPageSize: 10,
            form,
        }
    );
    const { submit } = search

    // 使用 useEffect 处理全局刷新事件
    useEffect(() => {
        const handleRefresh = () => {
            refresh();
            message.success('刷新成功', 1);
        };

        window.addEventListener('refreshClasses', handleRefresh);

        // 组件初始化时执行一次查询
        refresh();

        return () => {
            window.removeEventListener('refreshClasses', handleRefresh);
        };
    }, []);

    const columns: ColumnType<any>[] = [
        {
            title: '基本信息',
            dataIndex: 'username',
            width: 240,
            render: (_: any, record: any) => (
                <div className={styles.userInfo}>
                    <Avatar
                        size={56}
                        src={`${BASE_URL}/${record.avatar}`}
                        icon={<UserOutlined />}
                        className={styles.avatar}
                    />
                    <div className={styles.userMeta}>
                        <Text strong className={styles.username}>{record.username}</Text>
                        <Badge
                            status="processing"
                            text={record.class_name}
                            className={styles.className}
                        />
                    </div>
                </div>
            ),
        },
        {
            title: '学号',
            dataIndex: 'student_no',
            width: 150,
            render: (text: string) => (
                <Space>
                    <IdcardOutlined />
                    <Text>{text}</Text>
                </Space>
            ),
        },
        {
            title: '就业状态',
            dataIndex: 'status',
            width: 120,
            render: (text: number) => {
                const status = employmentStatusMap.find(item => item[0] === text);
                return (
                    <Tag color={getStatusColor(text)}>
                        {status ? status[1] : '未填写'}
                    </Tag>
                );
            },
        },
        {
            title: '意向地区',
            dataIndex: 'province',
            width: 150,
            render: (text: number) => {
                const province = provinceMap.find(item => item[0] === text);
                return (
                    <Space>
                        <EnvironmentOutlined />
                        <Text>{province ? province[1] : '未填写'}</Text>
                    </Space>
                );
            },
        },
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={styles.classesContainer}
        >
            {/* 表格卡片 */}
            <motion.div variants={itemVariants} style={{ marginTop: 24 }}>
                <ProCard
                    className={styles.tableCard}
                    bordered={false}
                    hoverable
                >
                    <div className={styles.cardHeader}>
                        <Title level={4}>班级成员列表</Title>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <Form form={form} layout="inline">
                            <Form.Item name="search" label="姓名/学号">
                                <Input placeholder="请输入姓名/学号" allowClear />
                            </Form.Item>
                            <Form.Item name="status" label="就业状态">
                                <Select
                                    placeholder="请选择就业状态"
                                    allowClear
                                    style={{ width: 150 }}
                                    options={employmentStatusMap.map((item: any) => ({
                                        label: item[1],
                                        value: item[0],
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item name="province" label="意向地区">
                                <Select
                                    placeholder="请选择意向地区"
                                    allowClear
                                    style={{ width: 150 }}
                                    options={provinceMap.map((item: any) => ({
                                        label: item[1],
                                        value: item[0],
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" onClick={() => {
                                    submit();
                                }}>
                                    查询
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                    <Table
                        {...tableProps}
                        size="small"
                        columns={columns}
                        className={styles.customTable}
                    />
                </ProCard>
            </motion.div>
        </motion.div>
    );
}

export default Classes