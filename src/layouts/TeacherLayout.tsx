import logo from '@/assets/logo.jpg';
import PageLoading from '@/components/PageLoding';
import { ROLE } from '@/constants/role';
import { changeTeacherPassword } from '@/service/teacher/info';
import { useRoleStore } from '@/store/useRoleStore';
import { useTeacherStore } from '@/store/useTeacherStore';
import { isLogin, removeToken } from '@/utils/utils';
import { FullscreenOutlined, LockFilled, ReloadOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer, ProLayout } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Button, Dropdown, Form, Input, message, Modal, notification, Watermark } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, Outlet, useLocation } from 'umi';
import teacherDefaultProps from './_teacherDefaultProps';
import { BASE_URL } from '@/config';

const TeacherLayout: React.FC = () => {
    const location = useLocation();
    const { userInfo } = useTeacherStore();
    const [passwordModal, setPasswordModal] = useState(false);
    const [passwordForm] = Form.useForm();
    const role = useRoleStore((state) => state.role);

    // 如果不是教师角色，重定向到登录页
    useEffect(() => {
        if (role !== ROLE.TEACHER) {
            history.replace('/student/403');
        }
    }, [role]);

    // 处理修改密码
    const { loading: changingPassword, run: runChangePassword } = useRequest(changeTeacherPassword, {
        manual: true,
        onSuccess: (res: any) => {
            if (res.code === 200) {
                notification.success({
                    message: '密码修改成功，请重新登录',
                });
                setPasswordModal(false);
                removeToken();
                useRoleStore.getState().clearRole();
                useTeacherStore.getState().clearUserInfo();
                history.replace('/teacher/login');
            }
        },
        onError: (error: any) => {
            message.error(error.message);
        },
    });

    const handleChangePassword = async (values: any) => {
        if (values.new_password !== values.confirm_password) {
            message.error('两次输入的密码不一致');
            return;
        }
        await runChangePassword(values);
    };

    const userMenuItems = [
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置'
        },
        {
            key: 'change_password',
            icon: <LockFilled />,
            label: '修改密码'
        },
        {
            key: 'logout',
            icon: <UserOutlined />,
            label: '退出登录'
        }
    ];

    const handleUserMenuClick = async (info: { key: string }) => {
        if (info.key === 'logout') {
            removeToken();
            useRoleStore.getState().clearRole();
            useTeacherStore.getState().clearUserInfo();
            message.success('退出登录成功');
            history.replace('/login');
        } else if (info.key === 'settings') {
            history.push('/teacher/settings');
        } else if (info.key === 'change_password') {
            setPasswordModal(true);
        }
    };

    // 教师专用的刷新函数映射
    const refreshFunctions: Record<string, () => void> = {
        '/teacher/manager/notices': () => {
            window.dispatchEvent(new CustomEvent('refreshNotices'));
        },
        '/teacher/manager/classes': () => {
            window.dispatchEvent(new CustomEvent('refreshClasses'));
        },
        '/teacher/manager/students': () => {
            window.dispatchEvent(new CustomEvent('refreshStudents'));
        },
        '/teacher/home': () => {
            window.dispatchEvent(new CustomEvent('refreshHome'));
        },
        '/teacher/settings': () => {
            window.dispatchEvent(new CustomEvent('refreshSettings'));
        },
        '/teacher/echarts/basic': () => {
            window.dispatchEvent(new CustomEvent('refreshBasic'));
        },
    };

    // 处理刷新按钮点击
    const handleRefresh = () => {
        const refreshFunction = refreshFunctions[location.pathname];
        if (refreshFunction) {
            refreshFunction();
            message.success('刷新成功');
        }
    };

    const handleFullscreen = () => {
        document.documentElement.requestFullscreen();
    };

    return (
        isLogin() ? (
            <>
                <ProLayout
                    {...teacherDefaultProps}
                    title="应届生管理系统"
                    logo={<img src={logo} alt="logo" style={{ width: 32, height: 32 }} />}
                    layout="mix"
                    siderWidth={216}
                    actionsRender={(props) => {
                        if (props.isMobile) return [];
                        return [
                            <ReloadOutlined
                                key="ReloadOutlined"
                                onClick={handleRefresh}
                                style={{ cursor: 'pointer' }}
                            />,
                            <FullscreenOutlined
                                key="FullscreenOutlined"
                                onClick={handleFullscreen}
                                style={{ cursor: 'pointer' }}
                            />
                        ];
                    }}
                    avatarProps={{
                        src: `${BASE_URL}/${userInfo?.avatar}`,
                        title: userInfo?.username || '未登录',
                        size: 'small',
                        render: (_, dom) => (
                            <Dropdown menu={{
                                items: userMenuItems,
                                onClick: handleUserMenuClick,
                            }}>
                                {dom}
                            </Dropdown>
                        ),
                    }}
                    menuItemRender={(item, dom) => (
                        <div onClick={() => item.path && history.push(item.path)}>
                            {dom}
                        </div>
                    )}
                    breadcrumbRender={(routers = []) => [
                        {
                            path: '/teacher/home',
                            title: '首页',
                        },
                        ...routers,
                    ]}
                >
                    {/* 页面容器，包括标题、内容、面包屑等 */}
                    <PageContainer
                        header={{
                            title: '',
                        }}
                    >
                        <Watermark content={userInfo?.username}>
                            <Outlet />
                        </Watermark>
                    </PageContainer>
                </ProLayout>

                <Modal
                    title="修改密码"
                    open={passwordModal}
                    onCancel={() => {
                        setPasswordModal(false);
                        passwordForm.resetFields();
                    }}
                    footer={null}
                >
                    <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handleChangePassword}
                    >
                        <Form.Item
                            label="原密码"
                            name="old_password"
                            rules={[
                                { required: true, message: '请输入原密码' },
                                { min: 6, message: '密码长度不能小于6位' }
                            ]}
                        >
                            <Input.Password placeholder="请输入原密码" />
                        </Form.Item>

                        <Form.Item
                            label="新密码"
                            name="new_password"
                            rules={[
                                { required: true, message: '请输入新密码' },
                                { min: 6, message: '密码长度不能小于6位' }
                            ]}
                        >
                            <Input.Password placeholder="请输入新密码" />
                        </Form.Item>

                        <Form.Item
                            label="确认新密码"
                            name="confirm_password"
                            rules={[
                                { required: true, message: '请确认新密码' },
                                { min: 6, message: '密码长度不能小于6位' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('new_password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次输入的密码不一致'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="请确认新密码" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={changingPassword} block>
                                确认修改
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        ) : <PageLoading />
    );
};

export default TeacherLayout;