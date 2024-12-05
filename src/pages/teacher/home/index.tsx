import React, { useEffect } from "react";
import { Card, Typography, Row, Col, Statistic, Space, Avatar, List, Tag, Skeleton, message, Spin } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import {
    UserOutlined,
    PhoneOutlined,
    TeamOutlined,
    CrownOutlined,
    BookOutlined,
} from '@ant-design/icons';
import { useRequest } from "ahooks";
import { getTeacherInfo } from "@/service/teacher/info";
import styles from './index.less';

const { Title, Text } = Typography;

const TeacherHome: React.FC = () => {
    // 获取教师信息
    const { data, loading, refresh } = useRequest(async () => {
        await new Promise(resolve => setTimeout(resolve, 500)); // 添加加载动画效果
        return getTeacherInfo();
    });

    const teacherInfo = data?.data;

    // 获取当前时间
    const currentHour = new Date().getHours();
    const getGreeting = () => {
        if (currentHour < 12) return '早上好';
        if (currentHour < 18) return '下午好';
        return '晚上好';
    };

    // 监听刷新事件
    useEffect(() => {
        const handleRefresh = () => {
            refresh();
        };

        window.addEventListener('refreshHome', handleRefresh);
        return () => {
            window.removeEventListener('refreshHome', handleRefresh);
        };
    }, [refresh]);

    return (
        <div className={styles.container}>
            {loading ?
                <div style={{ display: 'flex', justifyContent: 'center', height: '100%', top: "100" }}>
                    <Spin size="large" />
                </div> : (
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        {/* 欢迎卡片 */}
                        <ProCard className={styles.welcomeCard}>
                            <Row align="middle" gutter={24}>
                                <Col>
                                    <Avatar
                                        size={100}
                                        src={`http://127.0.0.1:8000${teacherInfo?.avatar}`}
                                        icon={<UserOutlined />}
                                        className={styles.avatar}
                                    />
                                </Col>
                                <Col flex="auto">
                                    <Space direction="vertical" size={4}>
                                        <Title level={2} className={styles.greeting}>
                                            {getGreeting()}，{teacherInfo?.username}老师
                                        </Title>
                                        <Space split={<Text type="secondary">|</Text>} size={20}>
                                            <Text><PhoneOutlined /> {teacherInfo?.phone}</Text>
                                            <Text><TeamOutlined /> 共管理 {teacherInfo?.total_students} 名学生</Text>
                                            <Text><BookOutlined /> 管理 {teacherInfo?.classes?.length} 个班级</Text>
                                        </Space>
                                    </Space>
                                </Col>
                            </Row>
                        </ProCard>

                        {/* 统计数据 */}
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card hoverable className={styles.statsCard}>
                                    <Statistic
                                        title={<span className={styles.statTitle}>管理班级数</span>}
                                        value={teacherInfo?.classes?.length}
                                        prefix={<BookOutlined className={styles.statIcon} />}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card hoverable className={styles.statsCard}>
                                    <Statistic
                                        title={<span className={styles.statTitle}>总学生数</span>}
                                        value={teacherInfo?.total_students}
                                        prefix={<TeamOutlined className={styles.statIcon} />}
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card hoverable className={styles.statsCard}>
                                    <Statistic
                                        title={<span className={styles.statTitle}>平均班级规模</span>}
                                        value={Math.round(teacherInfo?.total_students / teacherInfo?.classes?.length)}
                                        prefix={<CrownOutlined className={styles.statIcon} />}
                                        valueStyle={{ color: '#722ed1' }}
                                        suffix="人/班"
                                    />
                                </Card>
                            </Col>
                        </Row>

                        {/* 班级列表 */}
                        <ProCard
                            title="管理的班级"
                            headerBordered
                            className={styles.classesCard}
                        >
                            <List
                                grid={{ gutter: 16, column: 3 }}
                                dataSource={teacherInfo?.classes}
                                renderItem={(item: any) => (
                                    <List.Item>
                                        <Card
                                            hoverable
                                            className={styles.classCard}
                                            actions={[
                                                <span key="students">
                                                    <TeamOutlined /> {item.student_count} 名学生
                                                </span>
                                            ]}
                                        >
                                            <Card.Meta
                                                avatar={<Avatar icon={<BookOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                                                title={item.name}
                                                description={
                                                    <Tag color="blue">
                                                        {Math.round(item.student_count / teacherInfo.total_students * 100)}% 占比
                                                    </Tag>
                                                }
                                            />
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        </ProCard>
                    </Space>
                )}
        </div>
    );
};

export default TeacherHome;