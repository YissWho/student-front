import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Avatar, Button, List, Tag, Skeleton, Spin } from 'antd';
import { useUserStore } from '@/store/useUserStore';
import {
    UserOutlined,
    IdcardOutlined,
    FormOutlined,
    BellOutlined,
    TeamOutlined,
    EnvironmentOutlined,
    PhoneOutlined
} from '@ant-design/icons';
import { history } from 'umi';
import { motion } from 'framer-motion';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { fetchStudentInfo } from '@/service/student/info';

const { Title, Paragraph, Text } = Typography;

const quickLinks = [
    {
        title: '问卷调查',
        icon: <FormOutlined style={{ fontSize: '24px' }} />,
        path: '/student/survey',
        color: '#1890ff',
        description: '填写就业意向调查问卷'
    },
    {
        title: '个人设置',
        icon: <UserOutlined style={{ fontSize: '24px' }} />,
        path: '/student/settings',
        color: '#52c41a',
        description: '更新个人信息和设置'
    },
    {
        title: '通知中心',
        icon: <BellOutlined style={{ fontSize: '24px' }} />,
        path: '/student/notice',
        color: '#faad14',
        description: '查看最新通知和公告'
    },
    {
        title: '班级信息',
        icon: <TeamOutlined style={{ fontSize: '24px' }} />,
        path: '/student/classes',
        color: '#722ed1',
        description: '查看班级相关信息'
    }
];

const StudentHome: React.FC = () => {
    const [basicInfo, setBasicInfo] = useState<any>(null);
    const [statusInfo, setStatusInfo] = useState<any>(null);

    // 获取学生信息
    const { loading } = useRequest(fetchStudentInfo, {
        onSuccess(res: any) {
            setBasicInfo(res.data.basic_info);
            setStatusInfo(res.data.status_info);
        }
    });

    // 获取当前时间
    const currentHour = new Date().getHours();
    const getGreeting = () => {
        if (currentHour < 12) return '早上好';
        if (currentHour < 18) return '下午好';
        return '晚上好';
    };

    // 获取就业状态对应的颜色
    const getStatusColor = (status: number | null | undefined) => {
        const colorMap: Record<number, string> = {
            0: 'green',    // 就业
            1: 'blue',     // 考研
            2: 'gold',     // 创业
            3: ''          // 其他
        };
        return colorMap[status ?? 3] || 'default';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" tip="加载中..." />
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={styles.homeContainer}
        >
            {/* 欢迎卡片 */}
            <motion.div variants={itemVariants}>
                <Card className={styles.welcomeCard}>
                    <Row gutter={24} align="middle">
                        <Col>
                            <Avatar
                                size={64}
                                src={`http://127.0.0.1:8000${basicInfo?.avatar}`}
                                icon={<UserOutlined />}
                            />
                        </Col>
                        <Col flex="1">
                            <Title level={4}>
                                {getGreeting()}，{basicInfo?.username}
                                <Tag color={getStatusColor(statusInfo?.status)} style={{ marginLeft: 12 }}>
                                    {statusInfo?.status_display || '未填写'}
                                </Tag>
                            </Title>
                            <div style={{ display: 'flex', gap: '16px', color: 'rgba(0, 0, 0, 0.45)' }}>
                                <Text><IdcardOutlined /> 学号：{basicInfo?.student_no}</Text>
                                <Text><TeamOutlined /> {basicInfo?.class_name}</Text>
                                <Text><PhoneOutlined /> {basicInfo?.phone}</Text>
                                <Text><UserOutlined /> 导师：{basicInfo?.teacher}</Text>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </motion.div>

            {/* 快速访问卡片 */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                {quickLinks.map((link, index) => (
                    <Col xs={24} sm={12} md={12} lg={6} key={link.title}>
                        <motion.div variants={itemVariants}>
                            <Card
                                hoverable
                                className={styles.quickLinkCard}
                                onClick={() => history.push(link.path)}
                                style={{ borderTop: `2px solid ${link.color}` }}
                            >
                                <div className={styles.iconWrapper} style={{ color: link.color }}>
                                    {link.icon}
                                </div>
                                <div className={styles.linkContent}>
                                    <Title level={5} style={{ color: link.color, marginBottom: 8 }}>
                                        {link.title}
                                    </Title>
                                    <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                        {link.description}
                                    </Paragraph>
                                </div>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            {/* 信息统计卡片 */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} md={8}>
                    <motion.div variants={itemVariants}>
                        <Card className={styles.statsCard}>
                            <Statistic
                                title="就业意向地区"
                                value={statusInfo?.province_display || '未填写'}
                                prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </motion.div>
                </Col>
                <Col xs={24} md={8}>
                    <motion.div variants={itemVariants}>
                        <Card className={styles.statsCard}>
                            <Statistic
                                title="未读通知"
                                value={basicInfo?.unread_notice_count}
                                prefix={<BellOutlined style={{ color: '#52c41a' }} />}
                                suffix="条"
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </motion.div>
                </Col>
                <Col xs={24} md={8}>
                    <motion.div variants={itemVariants}>
                        <Card className={styles.statsCard}>
                            <Statistic
                                title="就业状态"
                                value={statusInfo?.status_display || '未填写'}
                                prefix={<TeamOutlined style={{ color: getStatusColor(statusInfo?.status) }} />}
                                valueStyle={{ color: getStatusColor(statusInfo?.status) }}
                            />
                        </Card>
                    </motion.div>
                </Col>
            </Row>

            {/* 毕业进度 */}
            <motion.div variants={itemVariants} style={{ marginTop: 24 }}>
                <Card
                    title={
                        <div className={styles.cardTitle}>
                            <FormOutlined style={{ marginRight: 8 }} />
                            毕业进度
                        </div>
                    }
                    className={styles.activityCard}
                >
                    <Row gutter={[16, 16]}>
                        {[
                            { title: '毕业设计开题报告', status: '待开始', time: '2024-12-09' },
                            { title: '毕业设计', status: '待开始', time: '2024-12-10' },
                            { title: '毕业答辩', status: '待开始', time: '2025-05-05' },
                        ].map((item, index) => (
                            <Col span={8} key={index}>
                                <Card size="small" hoverable className={styles.progressCard}>
                                    <Paragraph strong>{item.title}</Paragraph>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Tag color={
                                            item.status === '已完成' ? 'success' :
                                                item.status === '进行中' ? 'processing' : 'default'
                                        }>
                                            {item.status}
                                        </Tag>
                                        <Text type="secondary">{item.time}</Text>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default StudentHome;