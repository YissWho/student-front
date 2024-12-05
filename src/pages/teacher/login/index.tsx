import React from 'react';
import { Form, Input, Button, message, Spin, notification } from 'antd';
import { PhoneOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';
import { login } from '@/service/teacher/login';
import { useRequest } from 'ahooks';
import { useUserStore } from '@/store/useUserStore';
import { setToken } from '@/utils/utils';
import { useRoleStore } from '@/store/useRoleStore';
import { ROLE, ROLE_PATH_MAP } from '@/constants/role';
import { useTeacherStore } from '@/store/useTeacherStore';

interface LoginForm {
    phone: string;
    password: string;
}

const TeacherLogin: React.FC = () => {
    const [form] = Form.useForm();
    const setUserInfo = useTeacherStore((state) => state.setUserInfo);
    const setRole = useRoleStore((state) => state.setRole);
    const { run, loading } = useRequest(login, {
        manual: true,
        onSuccess(res) {
            if (res.code === 200) {
                if (res.data.role !== ROLE.TEACHER) {
                    message.error('无效的用户类型');
                    return;
                }
                setUserInfo(res.data?.user);
                setRole(res.data.role);
                setToken(res.data.token);
                history.replace(ROLE_PATH_MAP[ROLE.TEACHER]);
                notification.success({
                    message: '登录成功!',
                    description: '欢迎回来！',
                });
            }
        },
        onError: (error: any) => {
            message.error(error.message || '登录失败，请重试');
        }
    });

    const onFinish = async (values: LoginForm) => {
        run(values);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <div className={styles.loginHeader}>
                    <h1 className={styles.title}>应届生去向系统</h1>
                    <p className={styles.subtitle}>教师登录入口</p>
                </div>

                <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                    <Form
                        form={form}
                        name="login"
                        onFinish={onFinish}
                        className={styles.loginForm}
                    >
                        <Form.Item
                            name="phone"
                            rules={[
                                { required: true, message: '请输入手机号' },
                                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                            ]}
                        >
                            <Input
                                prefix={<PhoneOutlined className={styles.inputIcon} />}
                                placeholder="请输入手机号"
                                size="large"
                                disabled={loading}
                                className={styles.input}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: '请输入密码' },
                                { min: 6, message: '密码至少6位' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className={styles.inputIcon} />}
                                placeholder="请输入密码"
                                size="large"
                                disabled={loading}
                                className={styles.input}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                className={styles.loginButton}
                                loading={loading}
                            >
                                {loading ? '登录中...' : '登录'}
                            </Button>
                        </Form.Item>

                        <div className={styles.extraLinks}>
                            <Button
                                type="link"
                                onClick={() => history.replace('/login')}
                                className={styles.linkButton}
                            >
                                返回学生登录
                            </Button>
                        </div>
                    </Form>
                </Spin>
            </div>
        </div>
    );
};

export default TeacherLogin;