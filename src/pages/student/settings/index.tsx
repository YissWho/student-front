import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Upload, message, Avatar, Row, Col, Typography, Spin } from 'antd';
import {
    UserOutlined,
    UploadOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    BookOutlined
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { updateStudentInfo, getStudentInfo } from '@/service/student/info';
import { useUserStore } from '@/store/useUserStore';
import { employmentStatusMap, provinceMap } from "@/utils/utils";
import { motion } from 'framer-motion';
import styles from './index.less';

const { Option } = Select;
const { Title, Text } = Typography;

const Settings: React.FC = () => {
    const [form] = Form.useForm();
    const info = useUserStore((state) => state.info);
    const setInfo = useUserStore((state) => state.setInfo);
    const { basic_info } = info;
    const [currentStatus, setCurrentStatus] = useState<number>(0);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    // 获取学生信息
    const { data: studentInfo, loading: fetchLoading, run: fetchStudentInfo } = useRequest(
        async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return getStudentInfo();
        },
        {
            onSuccess: (res: any) => {
                const info = res.data;
                setCurrentStatus(info.status);
                // 设置表单初始值
                form.setFieldsValue({
                    username: basic_info?.username,
                    phone: info.phone,
                    status: info.status,
                    province: info.province,
                    study_school: info.study_school,
                    study_major: info.study_major,
                });
            },
        }
    );

    // 更新信息请求
    const { loading: updating, run: updateInfo } = useRequest(updateStudentInfo, {
        manual: true,
        onSuccess: (res: any) => {
            if (res.code === 200) {
                // 更新全局状态
                const storeData = {
                    basic_info: {
                        ...info.basic_info,
                        phone: res.data.phone,
                        avatar: res.data.avatar,
                        username: res.data.username,
                    },
                    status_info: {
                        status: res.data.status,
                        status_display: res.data.status_display,
                        province: res.data.province,
                        province_display: res.data.province_display,
                        province_type: res.data.province_type
                    }
                };
                setInfo(storeData);
                fetchStudentInfo();
                message.success('更新成功');
            }
        }
    });

    // 监听状态变化，动态处理表单字段
    useEffect(() => {
        if (currentStatus === 0) {
            // 如果选择就业状态，清空升学相关字段
            form.setFieldsValue({
                study_school: undefined,
                study_major: undefined
            });
        }
    }, [currentStatus, form]);

    const handleStatusChange = (value: number) => {
        setCurrentStatus(value);
    };

    // 处理表单提交
    const handleFinish = async (values: any) => {
        const formData = new FormData();
        // 如果有头像文件，添加到表单数据
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }
        // 添加其他表单数据
        Object.keys(values).forEach(key => {
            if (key !== 'avatar' && values[key] !== undefined) {
                formData.append(key, values[key].toString());
            }
        });
        // 如果是就业状态，清空升学相关字段
        if (values.status === 0) {
            formData.append('study_school', '');
            formData.append('study_major', '');
        }
        await updateInfo(formData);
    };

    // 监听全局刷新事件
    useEffect(() => {
        const handleRefresh = () => {
            fetchStudentInfo();
            message.success('刷新成功', 1);
        };

        window.addEventListener('refreshSettings', handleRefresh);
        return () => {
            window.removeEventListener('refreshSettings', handleRefresh);
        };
    }, []);

    // motion动画配置
    // containerVariants 定义容器的动画状态
    const containerVariants = {
        // 初始状态
        hidden: { opacity: 0 },
        // 显示状态
        visible: {
            opacity: 1,
            transition: {
                // staggerChildren 使子元素依次显示，间隔0.1秒
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

    if (fetchLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" tip="加载中..." />
            </div>
        );
    }

    return (
        // motion.div 是 framer-motion 提供的动画组件
        // variants 定义动画变体
        // initial 定义初始状态
        // animate 定义动画目标状态
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={styles.settingsContainer}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <motion.div variants={itemVariants}>
                        <Card className={styles.avatarCard}>
                            <div className={styles.avatarSection}>
                                <Avatar
                                    size={120}
                                    src={avatarFile ? URL.createObjectURL(avatarFile) :
                                        studentInfo?.data.avatar ? `http://127.0.0.1:8000${studentInfo.data.avatar}` : undefined}
                                    icon={<UserOutlined />}
                                />
                                <Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>
                                    {basic_info?.username}
                                </Title>
                                <Text type="secondary">{basic_info?.student_no}</Text>
                                <Upload
                                    name="avatar"
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        setAvatarFile(file);
                                        return false;
                                    }}
                                    accept="image/*"
                                >
                                    <Button type="primary" icon={<UploadOutlined />} style={{ marginTop: 16 }}>
                                        更换头像
                                    </Button>
                                </Upload>
                            </div>
                        </Card>
                    </motion.div>
                </Col>

                <Col xs={24} md={16}>
                    <motion.div variants={itemVariants}>
                        <Card className={styles.formCard}>
                            <Title level={4} style={{ marginBottom: 24 }}>个人信息</Title>
                            <Spin spinning={updating}>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleFinish}
                                >
                                    <Form.Item
                                        label="姓名"
                                        name="username"
                                    >
                                        <Input
                                            prefix={<UserOutlined className={styles.inputIcon} />}
                                            value={basic_info?.username}
                                            disabled
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="手机号码"
                                        name="phone"
                                        rules={[
                                            { required: true, message: '请输入手机号码' },
                                            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码格式' }
                                        ]}
                                    >
                                        <Input
                                            prefix={<PhoneOutlined className={styles.inputIcon} />}
                                            placeholder="请输入手机号码"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="就业状态"
                                        name="status"
                                        rules={[{ required: true, message: '请选择就业状态' }]}
                                    >
                                        <Select
                                            onChange={handleStatusChange}
                                            placeholder="请选择就业状态"
                                        >
                                            {employmentStatusMap.map((item: any) => (
                                                <Option key={item[0]} value={item[0]}>{item[1]}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="意向地区"
                                        name="province"
                                        rules={[{ required: true, message: '请选择意向地区' }]}
                                    >
                                        <Select
                                            placeholder="请选择意向地区"
                                            suffixIcon={<EnvironmentOutlined className={styles.inputIcon} />}
                                        >
                                            {provinceMap.map((item: any) => (
                                                <Option key={item[0]} value={item[0]}>{item[1]}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    {/* 升学相关表单项，仅在选择升学时显示 */}
                                    {currentStatus === 1 && (
                                        // 使用motion.div添加动画效果
                                        <motion.div
                                            // 初始状态：高度0且透明
                                            initial={{ opacity: 0, height: 0 }}
                                            // 显示状态：自适应高度且完全显示
                                            animate={{ opacity: 1, height: 'auto' }}
                                            // 退出状态：高度0且透明
                                            exit={{ opacity: 0, height: 0 }}
                                            // 过渡动画持续0.3秒
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Form.Item
                                                label="升学院校"
                                                name="study_school"
                                                rules={[{ required: true, message: '升学状态下必须填写升学院校' }]}
                                            >
                                                <Input
                                                    prefix={<TeamOutlined className={styles.inputIcon} />}
                                                    placeholder="请输入升学院校"
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="升学专业"
                                                name="study_major"
                                                rules={[{ required: true, message: '升学状态下必须填写升学专业' }]}
                                            >
                                                <Input
                                                    prefix={<BookOutlined className={styles.inputIcon} />}
                                                    placeholder="请输入升学专业"
                                                />
                                            </Form.Item>
                                        </motion.div>
                                    )}

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" block>
                                            保存修改
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Spin>
                        </Card>
                    </motion.div>
                </Col>
            </Row>
        </motion.div>
    );
};

export default Settings;