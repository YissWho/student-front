import React, { useState, useEffect } from "react";
import { Timeline, Space, Radio, Button, Tag, Typography, message, Pagination, Skeleton, Spin } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { fetchNoticeList, markAsRead, markAsReadSingle } from '@/service/student/notice';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    UserOutlined,
    CheckOutlined,
    CheckCircleTwoTone
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;

interface Notice {
    id: number;
    title: string;
    content: string;
    teacher_name: string;
    created_at: string;
    is_read: boolean;
}

const Notice: React.FC = () => {
    const [readStatus, setReadStatus] = useState<number>(0);
    const [current, setCurrent] = useState(1);
    const pageSize = 10;

    // 获取通知列表
    const { data, loading, refresh } = useRequest(
        () => fetchNoticeList({
            is_read: readStatus,
            page: current,
            page_size: pageSize
        }),
        {
            refreshDeps: [readStatus, current]
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
        onSuccess: () => {
            message.success('已标记为已读');
            refresh();
        }
    });

    // 批量标记已读
    const { run: markMultipleAsRead, loading: markingMultiple } = useRequest(markAsRead, {
        manual: true,
        onSuccess: () => {
            message.success('已全部标记为已读');
            refresh();
        }
    });

    const notices = data?.data.results || [];
    const total = data?.data.count || 0;
    const unreadNotices = notices.filter((notice: Notice) => !notice.is_read);
    const unreadCount = unreadNotices.length;

    // 处理批量已读
    const handleMarkAllAsRead = () => {
        const unreadIds = unreadNotices.map((notice: Notice) => notice.id);
        if (unreadIds.length > 0) {
            markMultipleAsRead(unreadIds);
        }
    };

    // 处理页码变化
    const handlePageChange = (page: number) => {
        setCurrent(page);
    };

    return (
        <div>
            {loading ?
                <div style={{ paddingTop: 90, textAlign: 'center' }}>
                    <Spin size="large" />
                </div> : (
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                            <Radio.Group
                                value={readStatus}
                                onChange={e => {
                                    setReadStatus(e.target.value);
                                    setCurrent(1); // 切换状态时重置页码
                                }}
                                buttonStyle="solid"
                            >
                                <Radio.Button value=" ">全部</Radio.Button>
                                <Radio.Button value="1">已读</Radio.Button>
                                <Radio.Button value="0">
                                    未读 {unreadCount > 0 && <Tag style={{ marginLeft: 4 }}>{unreadCount}</Tag>}
                                </Radio.Button>
                            </Radio.Group>

                            {readStatus === 0 && unreadCount > 0 && (
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    loading={markingMultiple}
                                    onClick={handleMarkAllAsRead}
                                >
                                    一键已读 ({unreadCount})
                                </Button>
                            )}
                        </Space>
                        <ProCard>
                            <Timeline
                                mode="alternate"
                                items={notices.map((notice: Notice, index: number) => ({
                                    color: notice.is_read ? 'green' : 'blue',
                                    dot: notice.is_read ?
                                        <CheckCircleTwoTone twoToneColor="#52c41a" /> :
                                        <ClockCircleOutlined style={{ color: '#1890ff' }} />,
                                    children: (
                                        <div className={`notice-item ${notice.is_read ? 'notice-read' : 'notice-unread'} ${index % 2 === 0 ? 'notice-right' : 'notice-left'}`}>
                                            <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                                <div className="notice-header">
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
                                                <Paragraph style={{ margin: 0 }}>
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
                                        </div>
                                    )
                                }))}
                            />
                            {total > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
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
                    </Space>
                )}
        </div>
    );
};

export default Notice;