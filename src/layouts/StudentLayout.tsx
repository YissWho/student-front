import logo from '@/assets/logo.jpg';
import PageLoading from '@/components/PageLoding';
import { ROLE } from '@/constants/role';
import { changePassword, fetchStudentInfo } from '@/service/student/info';
import { fetchNoticeList, markAsRead } from '@/service/student/notice';
import { useRoleStore } from '@/store/useRoleStore';
import { useUserStore } from '@/store/useUserStore';
import { isLogin, removeToken } from '@/utils/utils';
import { FullscreenOutlined, LockFilled, NotificationOutlined, ReloadOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer, ProLayout } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { Avatar, Badge, Button, Dropdown, Form, Input, List, message, Modal, notification, Popover, Watermark } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { history, Outlet, useLocation } from 'umi';
import _defaultProps from './_defaultProps';
import { BASE_URL } from '@/config';


// 通知列表组件
const NoticeList = React.memo(({ notices, onViewAll, onMarkAllRead }: any) => (
    <div style={{ width: 300 }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 8
        }}>
            <span>未读通知</span>
            {notices.length > 0 && (
                <Button type="link" size="small" onClick={onMarkAllRead}>
                    全部已读
                </Button>
            )}
        </div>
        <div style={{ height: 400, overflowY: 'auto' }}>
            <List
                itemLayout="horizontal"
                dataSource={notices}
                renderItem={(item: any) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar icon={<UserOutlined />} />}
                            title={<a onClick={() => history.push('/student/notice')}>{item.title}</a>}
                            description={
                                <div>
                                    <div>{item.content.length > 50 ? `${item.content.slice(0, 50)}...` : item.content}</div>
                                    <div style={{ fontSize: 12, color: '#999' }}>
                                        {dayjs(item.created_at).format('YYYY-MM-DD HH:mm')}
                                    </div>
                                </div>
                            }
                        />
                    </List.Item>
                )}
                locale={{ emptyText: '暂无未读通知' }}
            />
        </div>
        {notices.length > 0 && (
            <div style={{
                textAlign: 'center',
                marginTop: 8,
                borderTop: '1px solid #f0f0f0',
                paddingTop: 8
            }}>
                <Button type="link" onClick={onViewAll}>
                    查看全部
                </Button>
            </div>
        )}
    </div>
));

// 密码修改模态框组件
const PasswordModal = React.memo(({ visible, onCancel, onOk, loading }: any) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        if (values.new_password !== values.confirm_password) {
            message.error('两次输入的密码不一致');
            return;
        }
        await onOk(values);
    };

    return (
        <Modal
            title="修改密码"
            open={visible}
            onCancel={() => {
                onCancel();
                form.resetFields();
            }}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
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
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        确认修改
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
});

// 用户菜单配置
const USER_MENU_ITEMS = [
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

// 主布局组件
const StudentLayout: React.FC = () => {
    const location = useLocation();
    const { basic_info } = useUserStore((state) => state.info);
    const logout = useUserStore((state) => state.logout);
    const setInfo = useUserStore((state) => state.setInfo);
    const [passwordModal, setPasswordModal] = useState(false);
    const [unreadNotices, setUnreadNotices] = useState<any[]>([]);
    const role = useRoleStore((state) => state.role);

    // 获取学生信息
    const { run: fetchInfo } = useRequest(fetchStudentInfo, {
        manual: true,
        onSuccess: (res) => {
            setInfo(res.data);
        }
    });

    // 获取通知列表
    const { data: noticeData, refresh: refreshNotices } = useRequest(
        () => fetchNoticeList({ is_read: '0' }),
        {
            pollingInterval: 30000,
        }
    );

    // 标记通知已读
    const { run: handleMarkAllAsRead } = useRequest(markAsRead, {
        manual: true,
        onSuccess: () => {
            message.success('已全部标记为已读');
            refreshNotices();
        }
    });

    // 修改密码
    const { loading: changingPassword, run: runChangePassword } = useRequest(changePassword, {
        manual: true,
        onSuccess: (res: any) => {
            if (res.code === 200) {
                notification.success({
                    message: '密码修改成功，请重新登录',
                });
                setPasswordModal(false);
                handleLogout();
            }
        },
    });

    /* 获取未读通知 */
    useEffect(() => {
        if (noticeData?.data?.results) {
            setUnreadNotices(noticeData.data.results);
        }
    }, [noticeData]);

    /* 检查角色 */
    useEffect(() => {
        if (role !== ROLE.STUDENT) {
            history.replace('/403');
        }
        fetchInfo();
    }, [role]);

    /* 处理用户菜单点击 */
    const handleUserMenuClick = useCallback(async (info: { key: string }) => {
        if (info.key === 'logout') {
            handleLogout();
        } else if (info.key === 'settings') {
            history.push('/student/settings');
        } else if (info.key === 'change_password') {
            setPasswordModal(true);
        }
    }, []);

    /* 处理登出 */
    const handleLogout = useCallback(() => {
        logout();
        removeToken();
        sessionStorage.removeItem('conversations');
        useRoleStore.getState().clearRole();
        message.success('退出登录成功');
        history.replace('/login');
    }, [logout]);

    /* 刷新函数映射 */
    const refreshFunctions = useMemo(() => ({
        '/student/notice': () => window.dispatchEvent(new CustomEvent('refreshNotice')),
        '/student/settings': () => window.dispatchEvent(new CustomEvent('refreshSettings')),
        '/student/classes': () => window.dispatchEvent(new CustomEvent('refreshClasses')),
        '/student/survey': () => window.dispatchEvent(new CustomEvent('refreshSurvey')),
    }), []);

    // 处理刷新
    const handleRefresh = useCallback(() => {
        const refreshFunction = refreshFunctions[location.pathname as keyof typeof refreshFunctions];
        if (refreshFunction) {
            refreshFunction();
        }
    }, [location.pathname, refreshFunctions]);

    // 处理全屏
    const handleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, []);

    // 登录页面不显示布局
    const loginPaths = ['/', '/teacher/login'];
    if (loginPaths.includes(location.pathname)) {
        return <Outlet />;
    }

    /* 渲染布局 */
    return (
        isLogin() ? (
            <div>
                <ProLayout
                    layout='mix'
                    siderWidth={216}
                    bgLayoutImgList={[
                        {
                            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                            left: 85,
                            bottom: 100,
                            height: '303px',
                        },
                        {
                            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                            bottom: -68,
                            right: -45,
                            height: '303px',
                        },
                        {
                            src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
                            bottom: 0,
                            left: 0,
                            width: '331px',
                        },
                    ]}
                    {..._defaultProps}
                    title="应届生管理系统"
                    logo={<img src={logo} alt="logo" style={{ width: 32, height: 32 }} />}
                    /* 操作按钮 */
                    actionsRender={(props) => {
                        if (props.isMobile) return [];
                        return [
                            <ReloadOutlined
                                key="reload"
                                onClick={handleRefresh}
                                style={{ cursor: 'pointer' }}
                            />,
                            <FullscreenOutlined
                                key="fullscreen"
                                onClick={handleFullscreen}
                                style={{ cursor: 'pointer' }}
                            />,
                            <Popover
                                key="notice"
                                content={
                                    <NoticeList
                                        notices={unreadNotices}
                                        onViewAll={() => history.push('/student/notice')}
                                        onMarkAllRead={() => {
                                            const ids = unreadNotices.map(notice => notice.id);
                                            handleMarkAllAsRead(ids);
                                        }}
                                    />
                                }
                                trigger="hover"
                                placement="bottom"
                                arrow={{ pointAtCenter: true }}
                            >
                                <Badge count={unreadNotices.length} size="small">
                                    <NotificationOutlined style={{ cursor: 'pointer' }} />
                                </Badge>
                            </Popover>
                        ];
                    }}
                    avatarProps={{
                        src: `${BASE_URL}/${basic_info?.avatar}`,
                        title: basic_info?.username || '未登录',
                        size: 'small',
                        render: (_, dom) => (
                            <Dropdown menu={{
                                items: USER_MENU_ITEMS,
                                onClick: handleUserMenuClick,
                            }}>
                                {dom}
                            </Dropdown>
                        ),
                    }}
                    /* 菜单项渲染 */
                    menuItemRender={(item, dom) => (
                        <div onClick={() => item.path && history.push(item.path)}>
                            {dom}
                        </div>
                    )}
                    /* 面包屑渲染 */
                    breadcrumbRender={(routers = []) => [
                        {
                            path: '/student/home',
                            title: '首页',
                        },
                        ...routers,
                    ]}
                >
                    {/* 页面容器 */}
                    <PageContainer header={{ title: '' }}>
                        {/* 水印 */}
                        <Watermark content={basic_info?.username}>
                            {/* 页面内容 */}
                            <Outlet />
                        </Watermark>
                    </PageContainer>
                </ProLayout>

                {/* 密码修改模态框 */}
                <PasswordModal
                    visible={passwordModal}
                    onCancel={() => setPasswordModal(false)}
                    onOk={runChangePassword}
                    loading={changingPassword}
                />
            </div>
        ) : <PageLoading />
    );
};

export default StudentLayout;