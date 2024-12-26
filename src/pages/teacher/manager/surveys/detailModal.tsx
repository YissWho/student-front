import React, { useState } from 'react';
import { Modal, Tabs, List, Avatar, Typography, Badge, Spin, Empty, Pagination, Space, Card, Row, Col, Statistic } from 'antd';
import { useRequest } from 'ahooks';
import { getTeacherSurveyStudent } from '@/service/teacher/mange/survey';
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { BASE_URL } from '@/config';

const { Text, Title } = Typography;

interface Student {
    id: number;
    username: string;
    student_no: number;
    avatar: string;
    class_name: string;
    submitted_at: string;
}

interface Survey {
    id: number;
    title: string;
    description: string;
    status: string;
    completed_count: number;
    uncompleted_count: number;
    total_count: number;
    completion_rate: number;
}

interface DetailModalProps {
    visible: boolean;
    survey: Survey;
    onClose: () => void;
    onViewStudentDetail: (studentId: number) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
    visible,
    survey,
    onClose,
    onViewStudentDetail
}) => {
    const [activeTab, setActiveTab] = useState('0');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    // 获取学生填写情况
    const { data, loading } = useRequest(
        () => getTeacherSurveyStudent({
            id: survey.id,
            page: currentPage,
            page_size: pageSize,
            status: activeTab
        }),
        {
            ready: visible,
            refreshDeps: [survey.id, currentPage, activeTab]
        }
    );

    const students: Student[] = data?.data?.list || [];
    const total = data?.data?.count || 0;

    // 将学生列表分成已读和未读
    const readStudents = students.filter(student => student.submitted_at);
    const unreadStudents = students.filter(student => !student.submitted_at);

    // 将学生列表分成三列显示
    const getGridItems = (list: Student[]) => {
        const gridList = [];
        for (let i = 0; i < list.length; i += 3) {
            const row = list.slice(i, i + 3);
            gridList.push(row);
        }
        return gridList;
    };

    const items = [
        {
            key: '0',
            label: (
                <span>
                    <ClockCircleOutlined style={{ marginRight: 8 }} />
                    未完成
                    <Badge
                        count={survey.uncompleted_count}
                        style={{ marginLeft: 8, backgroundColor: '#ff4d4f' }}
                    />
                </span>
            ),
            children: (
                <div style={{ minHeight: 200 }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Spin size="large" tip="加载中..." />
                        </div>
                    ) : unreadStudents.length === 0 ? (
                        <Empty description="暂无未完成学生" />
                    ) : (
                        <>
                            {getGridItems(unreadStudents).map((row, rowIndex) => (
                                <Row key={rowIndex} gutter={[16, 16]} style={{ marginBottom: 16 }}>
                                    {row.map((student) => (
                                        <Col span={8} key={student.id}>
                                            <Card hoverable size="small">
                                                <Space>
                                                    <Avatar
                                                        src={`${BASE_URL}/${student.avatar}`}
                                                        icon={<UserOutlined />}
                                                    />
                                                    <Space direction="vertical" size={0}>
                                                        <Text strong>{student.username}</Text>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {student.class_name}
                                                        </Text>
                                                    </Space>
                                                </Space>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ))}
                            <div style={{ textAlign: 'center', marginTop: 16 }}>
                                <Pagination
                                    current={currentPage}
                                    total={survey.uncompleted_count}
                                    pageSize={pageSize}
                                    onChange={setCurrentPage}
                                    showTotal={(total) => `共 ${total} 名未完成学生`}
                                />
                            </div>
                        </>
                    )}
                </div>
            )
        },
        {
            key: '1',
            label: (
                <span>
                    <CheckCircleOutlined style={{ marginRight: 8 }} />
                    已完成
                    <Badge
                        count={survey.completed_count}
                        style={{ marginLeft: 8, backgroundColor: '#52c41a' }}
                    />
                </span>
            ),
            children: (
                <div style={{ minHeight: 200 }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Spin size="large" tip="加载中..." />
                        </div>
                    ) : readStudents.length === 0 ? (
                        <Empty description="暂无已完成学生" />
                    ) : (
                        <>
                            {getGridItems(readStudents).map((row, rowIndex) => (
                                <Row key={rowIndex} gutter={[16, 16]} style={{ marginBottom: 16 }}>
                                    {row.map((student) => (
                                        <Col span={8} key={student.id}>
                                            <Card
                                                hoverable
                                                size="small"
                                                onClick={() => onViewStudentDetail(student.student_no)}
                                            >
                                                <Space>
                                                    <Avatar
                                                        src={`${BASE_URL}/${student.avatar}`}
                                                        icon={<UserOutlined />}
                                                    />
                                                    <Space direction="vertical" size={0}>
                                                        <Text strong>{student.username}</Text>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {student.class_name}
                                                        </Text>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            提交时间: {dayjs(student.submitted_at).format('YYYY-MM-DD HH:mm')}
                                                        </Text>
                                                    </Space>
                                                </Space>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ))}
                            <div style={{ textAlign: 'center', marginTop: 16 }}>
                                <Pagination
                                    current={currentPage}
                                    total={survey.completed_count}
                                    pageSize={pageSize}
                                    onChange={setCurrentPage}
                                    showTotal={(total) => `共 ${total} 名已完成学生`}
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
            style={{ top: 40 }}
            title={
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Title level={4}>{survey.title}</Title>
                    <Space size="large">
                        <Statistic
                            title="总人数"
                            value={survey.total_count}
                            suffix="人"
                        />
                        <Statistic
                            title="已完成"
                            value={survey.completed_count}
                            suffix="人"
                            valueStyle={{ color: '#52c41a' }}
                        />
                        <Statistic
                            title="未完成"
                            value={survey.uncompleted_count}
                            suffix="人"
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                        <Statistic
                            title="完成率"
                            value={survey.completion_rate}
                            suffix="%"
                            precision={2}
                        />
                    </Space>
                </Space>
            }
            open={visible}
            onCancel={onClose}
            width={800}
            footer={null}
        >
            <Tabs
                activeKey={activeTab}
                onChange={(key) => {
                    setActiveTab(key);
                    setCurrentPage(1); // 切换标签时重置页码
                }}
                items={items}
                style={{ marginTop: 24 }}
            />
        </Modal>
    );
};

export default DetailModal; 