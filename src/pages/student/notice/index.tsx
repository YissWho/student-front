import React, { useState, useEffect, useMemo } from "react";
import { Timeline, Space, Radio, Button, Tag, Typography, message, Pagination, Card, Row, Col, Statistic, Empty, Spin } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { fetchNoticeList, markAsRead, markAsReadSingle } from '@/service/student/notice';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    UserOutlined,
    CheckOutlined,
    CheckCircleTwoTone,
    BellOutlined,
    ReadOutlined,
    NotificationOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './index.less';

const { Text, Paragraph, Title } = Typography;

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

interface Notice {
    id: number;
    title: string;
    content: string;
    teacher_name: string;
    created_at: string;
    is_read: boolean;
}

const Notice: React.FC = () => {
    const [readStatus, setReadStatus] = useState<any>('');
    const [current, setCurrent] = useState(1);
    const pageSize = 10;

    // 获取通知列表
    const { data, loading, refresh } = useRequest(
        () => fetchNoticeList({
            is_read: readStatus || '',
            page: current,
            page_size: pageSize
        }),
        {
            refreshDeps: [readStatus, current],
            debounceWait: 300,
        }
    );

    // 监听刷新事件
    useEffect(() => {
        const handleRefresh = () => {
            refresh();
            message.success('刷新成功', 1);
        };

        window.addEventListener('refreshNotice', handleRefresh);
        return () => {
            window.removeEventListener('refreshNotice', handleRefresh);
        };
    }, [refresh]);

    // 标记单个通知为已读
    const { run: markSingleAsRead } = useRequest(markAsReadSingle, {
        manual: true,
        debounceWait: 1000,
        onSuccess: () => {
            message.success('已标记为已读');
            refresh();
        }
    });

    // 批量标记已读
    const { run: markMultipleAsRead, loading: markingMultiple } = useRequest(markAsRead, {
        manual: true,
        debounceWait: 1000,
        onSuccess: () => {
            message.success('已全部标记为已读');
            refresh();
        }
    });

    const notices = data?.data.results || [];
    const total = data?.data.count || 0;

    // 计算统计数据
    const stats = useMemo(() => {
        const allNotices = notices;
        const unread = allNotices.filter((notice: Notice) => !notice.is_read);
        const read = allNotices.filter((notice: Notice) => notice.is_read);
        const today = allNotices.filter((notice: Notice) =>
            dayjs(notice.created_at).isAfter(dayjs().startOf('day'))
        );

        return {
            total: total,
            unread: unread.length,
            read: read.length,
            today: today.length
        };
    }, [total, notices]);

    // 处理批量已读
    const handleMarkAllAsRead = () => {
        const unreadIds = notices.filter((notice: Notice) => !notice.is_read).map((notice: Notice) => notice.id);
        if (unreadIds.length > 0) {
            markMultipleAsRead(unreadIds);
        }
    };

    // 处理页码变化
    const handlePageChange = (page: number) => {
        setCurrent(page);
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={styles.noticeContainer}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin tip="加载中..." />
                </div>
            ) : (
                <>
                    {/* 统计卡片 */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                            <motion.div variants={itemVariants}>
                                <Card className={styles.statsCard}>
                                    <Statistic
                                        title="全部通知"
                                        value={stats.total}
                                        prefix={<BellOutlined style={{ color: '#1890ff' }} />}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Card>
                            </motion.div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <motion.div variants={itemVariants}>
                                <Card className={styles.statsCard}>
                                    <Statistic
                                        title="未读通知"
                                        value={stats.unread}
                                        prefix={<NotificationOutlined style={{ color: '#ff4d4f' }} />}
                                        valueStyle={{ color: '#ff4d4f' }}
                                    />
                                </Card>
                            </motion.div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <motion.div variants={itemVariants}>
                                <Card className={styles.statsCard}>
                                    <Statistic
                                        title="已读通知"
                                        value={stats.read}
                                        prefix={<ReadOutlined style={{ color: '#52c41a' }} />}
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Card>
                            </motion.div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <motion.div variants={itemVariants}>
                                <Card className={styles.statsCard}>
                                    <Statistic
                                        title="今日通知"
                                        value={stats.today}
                                        prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
                                        valueStyle={{ color: '#722ed1' }}
                                    />
                                </Card>
                            </motion.div>
                        </Col>
                    </Row>

                    {/* 主内容区 */}
                    <motion.div variants={itemVariants} style={{ marginTop: 24 }}>
                        <ProCard className={styles.noticeCard}>
                            <div className={styles.cardHeader}>
                                <Space size="large">
                                    <Title level={4}>通知列表</Title>
                                    <Radio.Group
                                        value={readStatus}
                                        onChange={e => {
                                            setReadStatus(e.target.value);
                                            setCurrent(1);
                                        }}
                                        buttonStyle="solid"
                                        defaultValue=""
                                    >
                                        <Radio.Button value="">全部</Radio.Button>
                                        <Radio.Button value="1">已读</Radio.Button>
                                        <Radio.Button value="0">
                                            未读
                                        </Radio.Button>
                                    </Radio.Group>
                                </Space>

                                <Space>
                                    {stats.unread > 0 && (
                                        <Button
                                            type="primary"
                                            icon={<CheckOutlined />}
                                            loading={markingMultiple}
                                            onClick={handleMarkAllAsRead}
                                        >
                                            一键已读(最多10条)
                                        </Button>
                                    )}
                                </Space>
                            </div>

                            {notices.length > 0 ? (
                                <Timeline
                                    mode="alternate"
                                    items={notices.map((notice: Notice, index: number) => ({
                                        color: notice.is_read ? 'green' : 'blue',
                                        dot: notice.is_read ?
                                            <CheckCircleTwoTone twoToneColor="#52c41a" /> :
                                            <ClockCircleOutlined style={{ color: '#1890ff' }} />,
                                        children: (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`${styles.noticeItem} ${notice.is_read ? styles.read : styles.unread} ${index % 2 === 0 ? styles.right : styles.left}`}
                                            >
                                                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                                    <div className={styles.noticeHeader}>
                                                        <Text strong={!notice.is_read}>
                                                            {notice.title}
                                                        </Text>
                                                        {!notice.is_read && (
                                                            <Button
                                                                type="link"
                                                                size="small"
                                                                icon={<CheckCircleOutlined />}
                                                                onClick={() => markSingleAsRead(notice.id)}
                                                            >
                                                                标记已读
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <Paragraph className={styles.noticeContent}>
                                                        {notice.content}
                                                    </Paragraph>
                                                    <Space split={<Text type="secondary">|</Text>}>
                                                        <Text type="secondary">
                                                            <UserOutlined /> {notice.teacher_name}
                                                        </Text>
                                                        <Text type="secondary">
                                                            {dayjs(notice.created_at).format('YYYY-MM-DD HH:mm')}
                                                        </Text>
                                                    </Space>
                                                </Space>
                                            </motion.div>
                                        )
                                    }))}
                                />
                            ) : (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="暂无通知"
                                />
                            )}

                            {total > 0 && (
                                <div className={styles.pagination}>
                                    <Pagination
                                        current={current}
                                        total={total}
                                        pageSize={pageSize}
                                        onChange={handlePageChange}
                                        showTotal={(total) => `共 ${total} 条通知`}
                                    />
                                </div>
                            )}
                        </ProCard>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
};

export default Notice;