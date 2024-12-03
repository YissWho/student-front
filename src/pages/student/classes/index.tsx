import React, { useEffect, useState, useMemo } from "react"
import { Avatar, message, Space, Table, TablePaginationConfig, Tag, Card, Row, Col, Statistic, Button } from 'antd';
import { ProCard } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { fetchClasses } from "@/service/student/classes";
import { employmentStatusMap, getStatusColor, provinceMap } from "@/utils/utils";
import BasicForm from "@/components/BasicForm";
import { FormField } from "@/components/BasicForm/types";
import { ColumnType } from "antd/es/table";
import { UserOutlined, IdcardOutlined, EnvironmentOutlined, TeamOutlined, RiseOutlined, AimOutlined, ReloadOutlined } from '@ant-design/icons';
import { Typography, Badge } from 'antd';
import styles from './index.less';

const { Text, Title } = Typography;

const Classes: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [search, setSearch] = useState({});

    const { data, loading, refresh } = useRequest(
        async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return fetchClasses({
                page: currentPage,
                page_size: pageSize,
                ...search,
            });
        },
        {
            refreshDeps: [currentPage, search],
            debounceWait: 300
        }
    );
    const total = data?.data.count || 0;

    const handleSearch = (values: any) => {
        setCurrentPage(1);
        setSearch({ ...values });
    };

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
                        src={`http://127.0.0.1:8000${record.avatar}`}
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
    const fields: FormField[] = [
        {
            name: 'search',
            label: '姓名/学号',
            type: 'input',
        },
        {
            name: 'status',
            label: '就业状态',
            type: 'select',
            options: employmentStatusMap.map((item: any) => ({
                label: item[1],
                value: item[0],
            })),
        },
        {
            name: 'province',
            label: '意向地区',
            type: 'select',
            options: provinceMap.map((item: any) => ({
                label: item[1],
                value: item[0],
            })),
        },
    ];
    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <ProCard
                className={styles.tableCard}
                bordered={false}
                hoverable
            >
                <Title level={4} style={{ marginBottom: 24 }}>班级成员列表</Title>
                <div style={{ marginBottom: 16 }}>
                    <BasicForm
                        fields={fields}
                        onSearch={handleSearch}
                    />
                </div>
                <Table
                    size="small"
                    columns={columns}
                    dataSource={data?.data.results}
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: total,
                        onChange: (page) => setCurrentPage(page),
                        showTotal: (total) => `共 ${total} 个班级成员`
                    }}
                    className={styles.customTable}
                />
            </ProCard>
        </Space>
    );
}

export default Classes