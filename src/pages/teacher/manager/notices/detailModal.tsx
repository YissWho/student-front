import React, { useState } from 'react';
import { Modal, Tabs, List, Avatar, Typography, Badge, Spin, Empty, Pagination } from 'antd';
import { useRequest } from 'ahooks';
import { getUnreadNoticeCount, getReadNoticeCount } from '@/service/teacher/mange/notice';
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styles from './detailModal.less';

const { Text, Paragraph, Title } = Typography;

interface DetailModalProps {
    open: boolean;
    onCancel: () => void;
    record: any;
}

export const DetailModal: React.FC<DetailModalProps> = ({ open, onCancel, record }) => {
    const [activeTab, setActiveTab] = useState('unread');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 30;

    // 获取未读学生列表
    const { data: unreadData, loading: unreadLoading } = useRequest(
        async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return getUnreadNoticeCount({
                id: record?.id,
                page: currentPage,
                page_size: pageSize
            });
        },
        {
            /* 只有在打开并且是未读标签时才请求 */
            ready: !!record?.id && open && activeTab === 'unread',
            refreshDeps: [currentPage]
        }
    );

    // 获取已读学生列表
    const { data: readData, loading: readLoading } = useRequest(
        async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return getReadNoticeCount({
                id: record?.id,
                page: currentPage,
                page_size: pageSize
            });
        },
        {
            /* 只有在打开并且是已读标签时才请求 */
            ready: !!record?.id && open && activeTab === 'read',
            refreshDeps: [currentPage]
        }
    );

    // 将学生列表分成三列
    const getGridItems = (list: any[] = []) => {
        const gridList = [];
        for (let i = 0; i < list.length; i += 3) {
            const row = list.slice(i, i + 3);
            gridList.push(row);
        }
        return gridList;
    };

    const items = [
        {
            key: 'unread',
            label: (
                <span>
                    <ClockCircleOutlined style={{ marginRight: 8 }} />
                    未读学生
                    <Badge
                        count={unreadData?.data?.count || 0}
                        style={{ marginLeft: 8, backgroundColor: '#ff4d4f' }}
                    />
                </span>
            ),
            children: (
                <div className={styles.studentList}>
                    {unreadLoading ? (
                        <Spin />
                    ) : (unreadData?.data?.list || []).length === 0 ? (
                        <Empty description="暂无未读学生" />
                    ) : (
                        <>
                            {getGridItems(unreadData?.data?.list).map((row, rowIndex) => (
                                <div key={rowIndex} className={styles.studentRow}>
                                    {row.map((item, index) => (
                                        <div key={index} className={styles.studentItem}>
                                            <Avatar
                                                src={`http://127.0.0.1:8000/${item.avatar}`}
                                                icon={<UserOutlined />}
                                                className={styles.avatar}
                                            />
                                            <Text className={styles.username}>{item.username}</Text>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <div className={styles.pagination}>
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={unreadData?.data?.count || 0}
                                    onChange={setCurrentPage}
                                    showTotal={(total) => `共 ${total} 名学生未读`}
                                />
                            </div>
                        </>
                    )}
                </div>
            )
        },
        {
            key: 'read',
            label: (
                <span>
                    <CheckCircleOutlined style={{ marginRight: 8 }} />
                    已读学生
                    <Badge
                        count={readData?.data?.count || 0}
                        style={{ marginLeft: 8, backgroundColor: '#52c41a' }}
                    />
                </span>
            ),
            children: (
                <div className={styles.studentList}>
                    {readLoading ? (
                        <Spin />
                    ) : (readData?.data?.list || []).length === 0 ? (
                        <Empty description="暂无已读学生" />
                    ) : (
                        <>
                            {getGridItems(readData?.data?.list).map((row, rowIndex) => (
                                <div key={rowIndex} className={styles.studentRow}>
                                    {row.map((item, index) => (
                                        <div key={index} className={styles.studentItem}>
                                            <Avatar
                                                src={`http://127.0.0.1:8000/${item.avatar}`}
                                                icon={<UserOutlined />}
                                                className={styles.avatar}
                                            />
                                            <Text className={styles.username}>{item.username}</Text>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <div className={styles.pagination}>
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={readData?.data?.count || 0}
                                    onChange={setCurrentPage}
                                    showTotal={(total) => `共 ${total} 名学生已读`}
                                />
                            </div>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <Modal
            open={open}
            style={{ top: 30 }}
            onCancel={onCancel}
            title="通知详情"
            width={680}
            footer={null}
            className={styles.detailModal}
        >
            <div className={styles.noticeContent}>
                <Title level={4}>{record?.title}</Title>
                <Paragraph className={styles.content}>
                    {record?.content}
                </Paragraph>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={items}
                className={styles.tabs}
            />
        </Modal>
    );
};

export default DetailModal