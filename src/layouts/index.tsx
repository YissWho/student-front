import { PageContainer, ProLayout } from '@ant-design/pro-layout';
import { Dropdown, message, Modal, Form, Input, Button, notification, Popover, List, Avatar, Badge } from 'antd';
import { UserOutlined, SettingOutlined, LockFilled, NotificationOutlined, ReloadOutlined, FullscreenOutlined } from '@ant-design/icons';
import { history, useLocation, Outlet } from 'umi';
import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { ProCard } from '@ant-design/pro-components';
import _defaultProps from './_defaultProps';
import { fetchStudentInfo, changePassword } from '@/service/student/info';
import { useRequest } from 'ahooks';
import { isLogin, removeToken } from '@/utils/utils';
import PageLoading from '@/components/PageLoding';
import { fetchNoticeList, markAsRead } from '@/service/student/notice';
import dayjs from 'dayjs';
import { useRoleStore } from '@/store/useRoleStore';
import { ROLE } from '@/constants/role';

const BasicLayout: React.FC = (props) => {
    const location = useLocation();
    const { basic_info } = useUserStore((state) => state.info);
    const token = useUserStore((state) => state.token);
    const logout = useUserStore((state) => state.logout);
    const setInfo = useUserStore((state) => state.setInfo);
    const [passwordModal, setPasswordModal] = useState(false);
    const [passwordForm] = Form.useForm();
    const [unreadNotices, setUnreadNotices] = useState<any[]>([]);

    const { data: noticeData, refresh: refreshNotices } = useRequest(
        () => fetchNoticeList({
            is_read: '0',
            page: '1',
            page_size: '10'
        }),
        {
            pollingInterval: 30000,
        }
    );

    const { run: handleMarkAllAsRead } = useRequest(markAsRead, {
        manual: true,
        onSuccess: () => {
            message.success('已全部标记为已读');
            refreshNotices();
        }
    });

    useEffect(() => {
        if (noticeData?.data?.results) {
            setUnreadNotices(noticeData.data.results);
        }
    }, [noticeData]);

    const role = useRoleStore((state) => state.role);

    // 如果不是学生角色，重定向到登录页
    useEffect(() => {
        if (role !== ROLE.STUDENT) {
            history.replace('/login');
        }
    }, [role]);

    const noticeContent = (
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
                {unreadNotices.length > 0 && (
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            const ids = unreadNotices.map(notice => notice.id);
                            handleMarkAllAsRead(ids);
                        }}
                    >
                        全部已读
                    </Button>
                )}
            </div>
            <div style={{ height: 400, overflowY: 'auto' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={unreadNotices}
                    renderItem={item => (
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
            {unreadNotices.length > 0 && (
                <div style={{
                    textAlign: 'center',
                    marginTop: 8,
                    borderTop: '1px solid #f0f0f0',
                    paddingTop: 8
                }}>
                    <Button
                        type="link"
                        onClick={() => history.push('/student/notice')}
                    >
                        查看全部
                    </Button>
                </div>
            )}
        </div>
    );

    const { loading: changingPassword, run: runChangePassword } = useRequest(changePassword, {
        manual: true,
        onSuccess: (res: any) => {
            if (res.code === 200) {
                notification.success({
                    message: '密码修改成功，请重新登录',
                });
                setPasswordModal(false);
                logout();
                removeToken();
                history.replace('/login');
            }
        },
    });

    // 处理修改密码
    const handleChangePassword = async (values: any) => {
        if (values.new_password !== values.confirm_password) {
            message.error('两次输入的密码不一致');
            return;
        }
        await runChangePassword(values);
    };

    // 登录页面不显示布局
    const loginPaths = ['/', '/teacher/login'];
    if (loginPaths.includes(location.pathname)) {
        return <Outlet />;
    }

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
            logout();
            removeToken();
            sessionStorage.removeItem('conversations');
            message.success('退出登录成功');
            history.replace('/login');
        } else if (info.key === 'settings') {
            history.push('/student/settings');
        } else if (info.key === 'change_password') {
            setPasswordModal(true);
        }
    };
    useRequest(fetchStudentInfo, {
        onSuccess: (res) => {
            setInfo(res.data);
        }
    })

    // 创建一个刷新函数映射
    const refreshFunctions: Record<string, () => void> = {
        '/student/notice': () => {
            // 通知页面的刷新逻辑
            window.dispatchEvent(new CustomEvent('refreshNotice'));
        },
        '/student/settings': () => {
            // 设置页面的刷新逻辑
            window.dispatchEvent(new CustomEvent('refreshSettings'));
        },
        '/student/classes': () => {
            // 班级页面的刷新逻辑
            window.dispatchEvent(new CustomEvent('refreshClasses'));
        },
    };

    // 处理刷新按钮点击
    const handleRefresh = () => {
        const refreshFunction = refreshFunctions[location.pathname];
        if (refreshFunction) {
            refreshFunction();
        }
    };

    const handleFullscreen = () => {
        document.documentElement.requestFullscreen();
    };

    return (
        isLogin() ? (
            <>
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
                    logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                    actionsRender={(props) => {
                        if (props.isMobile) return [];
                        return [
                            <ReloadOutlined
                                key="ReloadOutlined "
                                onClick={handleRefresh}
                                style={{ cursor: 'pointer' }}
                            />,
                            <FullscreenOutlined
                                key="FullscreenOutlined"
                                onClick={handleFullscreen}
                                style={{ cursor: 'pointer' }}
                            />,
                            <Popover
                                key="NotificationOutlined"
                                content={noticeContent}
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
                        src: `http://127.0.0.1:8000/${basic_info?.avatar}`,
                        title: basic_info?.username || '未登录',
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
                            path: '/student/home',
                            title: '首页',
                        },
                        ...routers,
                    ]}
                >
                    <PageContainer
                        header={{
                            title: '',
                        }}
                    >
                        <Outlet />
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

export default BasicLayout;