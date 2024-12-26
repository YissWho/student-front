import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, Space, Typography, Avatar, Skeleton, Divider, Spin } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { useTeacherStore } from '@/store/useTeacherStore';
import { changeTeacherInfo, getTeacherInfo } from '@/service/teacher/info';
import { UploadOutlined, UserOutlined, PhoneOutlined, EditOutlined, CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import styles from './index.less';
import { BASE_URL } from "@/config";

const { Title, Text } = Typography;

const Settings: React.FC = () => {
    const [form] = Form.useForm();
    const { userInfo } = useTeacherStore();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);

    // 获取教师信息
    const { data: teacherInfo, loading: fetchLoading, refresh } = useRequest(
        async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return getTeacherInfo();
        },
        {
            onSuccess: (res: any) => {
                form.setFieldsValue({
                    username: res.data.username,
                    phone: res.data.phone,
                });
            },
        }
    );

    // 更新信息请求
    const { loading: updating, run: updateInfo } = useRequest(changeTeacherInfo, {
        manual: true,
        onSuccess: (res: any) => {
            if (res.code === 200) {
                useTeacherStore.getState().setUserInfo(res.data);
                message.success('更新成功');
                setEditMode(false);
                refresh();
            }
        },
    });

    // 处理表单提交
    const handleFinish = async (values: any) => {
        const formData = new FormData();
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }
        Object.keys(values).forEach(key => {
            if (values[key] !== undefined) {
                formData.append(key, values[key]);
            }
        });
        updateInfo(formData);
    };

    // 处理头像上传
    const handleAvatarChange = (file: File) => {
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewAvatar(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        return false;
    };

    // 监听刷新事件
    useEffect(() => {
        const handleRefresh = () => {
            refresh();
        };

        window.addEventListener('refreshSettings', handleRefresh);
        return () => {
            window.removeEventListener('refreshSettings', handleRefresh);
        };
    }, [refresh]);

    return (
        <div className={styles.settingsContainer}>
            {fetchLoading ?
                <div style={{ display: 'flex', justifyContent: 'center', height: '100%', top: "100" }}>
                    <Spin size="large" />
                </div> : (
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <ProCard className={styles.profileCard}>
                            <div className={styles.headerSection}>
                                <Title level={2}>个人信息</Title>
                                <Button
                                    type={editMode ? "primary" : "default"}
                                    icon={editMode ? <CheckOutlined /> : <EditOutlined />}
                                    onClick={() => {
                                        if (editMode) {
                                            form.submit();
                                        } else {
                                            setEditMode(true);
                                        }
                                    }}
                                    loading={updating}
                                >
                                    {editMode ? '保存' : '编辑'}
                                </Button>
                            </div>

                            <div className={styles.avatarSection}>
                                <div className={styles.avatarWrapper}>
                                    <Avatar
                                        size={120}
                                        src={previewAvatar || `${BASE_URL}/${teacherInfo?.data.avatar}`}
                                        icon={<UserOutlined />}
                                        className={styles.avatar}
                                    />
                                    {editMode && (
                                        <Upload
                                            showUploadList={false}
                                            beforeUpload={handleAvatarChange}
                                            accept="image/*"
                                        >
                                            <div className={styles.avatarUpload}>
                                                <UploadOutlined />
                                                <span>更换头像</span>
                                            </div>
                                        </Upload>
                                    )}
                                </div>
                            </div>

                            <Divider />

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleFinish}
                                className={styles.form}
                            >
                                <Form.Item
                                    label="用户名"
                                    name="username"
                                    rules={[
                                        { required: true, message: '请输入用户名' },
                                        { min: 2, message: '用户名至少2个字符' }
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        disabled={!editMode}
                                        className={styles.input}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="手机号码"
                                    name="phone"
                                    rules={[
                                        { required: true, message: '请输入手机号码' },
                                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                                    ]}
                                >
                                    <Input
                                        prefix={<PhoneOutlined />}
                                        disabled={!editMode}
                                        className={styles.input}
                                    />
                                </Form.Item>
                            </Form>
                        </ProCard>
                    </Space>
                )}
        </div>
    );
};

export default Settings;