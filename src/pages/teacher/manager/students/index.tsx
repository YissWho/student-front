import React, { useEffect, useState } from "react";
import { Avatar, Badge, Button, Card, Space, Table, Tag, Typography, message, Popconfirm, Tooltip } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { useRequest } from "ahooks";
import { getTeacherStudents, deleteTeacherStudent } from "@/service/teacher/mange/students";
import { employmentStatusMap, getStatusColor, provinceMap } from "@/utils/utils";
import BasicForm from "@/components/BasicForm";
import { FormField } from "@/components/BasicForm/types";
import {
    UserOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    IdcardOutlined,
    TeamOutlined,
    PlusOutlined
} from '@ant-design/icons';
import styles from './index.less';
import { ColumnType } from "antd/es/table";
import { getTeacherClasses } from "@/service/common/common";
import { useTeacherStore } from "@/store/useTeacherStore";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import StudentFormModal from "./components/StudentFormModal";
const { Text, Title } = Typography;

const Students: React.FC = () => {
    const userInfo = useTeacherStore(state => state.userInfo);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number) => `共 ${total} 条数据`
    });
    const [searchParams, setSearchParams] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [editingStudent, setEditingStudent] = useState<any>(null);
    // 获取学生列表
    const { data, loading, run, refresh } = useRequest(
        (params: any) => getTeacherStudents({
            page: pagination.current,
            page_size: pagination.pageSize,
            ...params
        })
        ,
        {
            debounceWait: 300,
            refreshDeps: [pagination.current, pagination.pageSize],
            onSuccess: (res) => {
                setPagination(prev => ({
                    ...prev,
                    total: res.data.count
                }));
            }
        }
    );
    /* 获取教师班级列表 */
    const { data: classes } = useRequest(async () => getTeacherClasses(userInfo?.id));
    const columns: ColumnType<any>[] = [
        {
            title: '基本信息',
            dataIndex: 'username',
            fixed: 'left',
            width: 240,
            render: (_: any, record: any) => (
                <div className={styles.userInfo}>
                    <Avatar
                        size={48}
                        src={`http://127.0.0.1:8000${record.avatar}`}
                        icon={<UserOutlined />}
                        className={styles.avatar}
                    />
                    <div className={styles.userMeta}>
                        <Text strong>{record.username}</Text>
                        <div className={styles.userExtra}>
                            <Badge status="processing" text={record.class_name} />
                        </div>
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
                    <IdcardOutlined className={styles.columnIcon} />
                    <Text>{text}</Text>
                </Space>
            ),
        },
        {
            title: '联系方式',
            dataIndex: 'phone',
            width: 180,
            render: (text: string) => (
                <Space>
                    <PhoneOutlined className={styles.columnIcon} />
                    <Text>{text}</Text>
                </Space>
            ),
        },
        {
            title: '毕业状态',
            dataIndex: 'status',
            width: 120,
            render: (status: number, record: any) => {
                return (
                    <Tag color={getStatusColor(status)} className={styles.statusTag}>
                        {record.status_display || '未填写'}
                    </Tag>
                );
            },
        },
        {
            title: '意向地区',
            dataIndex: 'province',
            width: 150,
            render: (province: number, record: any) => (
                <Space>
                    <EnvironmentOutlined className={styles.columnIcon} />
                    <Text>{record.province_display || '未填写'}</Text>
                </Space>
            ),
        },
        {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            width: 120,
            render: (_, record: any) => (
                <Space>
                    <Tooltip title="编辑学生">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        >
                        </Button>
                    </Tooltip>
                    <Tooltip title="删除学生">
                        <Popconfirm
                            title="删除学生"
                            description={
                                <div>
                                    确定要删除学生 <Text strong>{record.username}</Text> 吗？
                                    <br />
                                    <Text type="secondary">此操作不可恢复</Text>
                                </div>
                            }
                            onConfirm={() => deleteStudent(record.id)}
                            okText="删除"
                            cancelText="取消"
                            okButtonProps={{
                                danger: true,
                                size: 'small'
                            }}
                            cancelButtonProps={{
                                size: 'small'
                            }}
                        >
                            <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                            >
                            </Button>
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        }
    ];

    // 搜索字段配置
    const fields: FormField[] = [
        {
            name: 'search',
            label: '学号/姓名',
            type: 'input',
        },
        {
            name: 'class',
            label: '班级',
            type: 'select',
            options: classes?.data?.map((cls: any) => ({
                label: cls.name,
                value: cls.id
            })) || []
        },
        {
            name: 'status',
            label: '就业状态',
            type: 'select',
            options: employmentStatusMap.map((item: any) => ({
                label: item[1],
                value: item[0]
            }))
        }
    ];

    const extraButtons = [
        <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
        >
            添加
        </Button>
    ];
    // 处理搜索
    const handleSearch = (values: any) => {
        setSearchParams(values);
        setPagination(prev => ({ ...prev, current: 1 }));
        run(values);
    };

    // 处理分页变化
    const handleTableChange = (newPagination: any) => {
        setPagination(prev => ({
            ...prev,
            current: newPagination.current,
            pageSize: newPagination.pageSize
        }));
        run({
            ...searchParams,
            page: newPagination.current,
            page_size: newPagination.pageSize
        });
    };

    // 处理编辑按钮点击
    const handleEdit = (record: any) => {
        setEditingStudent(record);
        setModalVisible(true);
    };

    // 在组件内添加删除功能
    const { run: deleteStudent } = useRequest(deleteTeacherStudent, {
        manual: true,
        onSuccess: (res: any) => {
            if (res.code === 200) {
                message.success('删除成功');
                // 刷新列表
                run(searchParams);
            }
        }
    });

    // 监听刷新事件
    useEffect(() => {
        const handleRefresh = () => {
            refresh();
        };

        window.addEventListener('refreshStudents', handleRefresh);
        return () => {
            window.removeEventListener('refreshStudents', handleRefresh);
        };
    }, [refresh]);

    return (
        <div className={styles.container}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* 统计卡片 */}
                <div className={styles.statsRow}>
                    <Card className={styles.statsCard}>
                        <TeamOutlined className={styles.statsIcon} />
                        <div className={styles.statsContent}>
                            <Text type="secondary">总学生数</Text>
                            <Title level={3}>{data?.data?.count || 0}</Title>
                        </div>
                    </Card>
                    {/* 可以添加更多统计卡片 */}
                </div>

                {/* 搜索和表格 */}
                <ProCard
                    className={styles.tableCard}
                    bodyStyle={{ padding: '20px 24px' }}
                >
                    <div className={styles.searchForm}>
                        <BasicForm
                            fields={fields}
                            onSearch={handleSearch}
                            extraButtons={extraButtons}
                        />
                    </div>

                    <Table
                        columns={columns}
                        dataSource={data?.data?.results}
                        loading={loading}
                        pagination={pagination}
                        onChange={handleTableChange}
                        rowKey="id"
                        className={styles.table}
                    />
                </ProCard>
            </Space>

            <StudentFormModal
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingStudent(null);
                }}
                onSuccess={() => {
                    setModalVisible(false);
                    setEditingStudent(null);
                    run(searchParams);
                }}
                classes={classes?.data || []}
                editData={editingStudent}
            />
        </div>
    );
};

export default Students;