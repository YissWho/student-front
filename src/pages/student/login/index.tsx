import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin, notification, Col, Row } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';
import { fetchStudentLogin } from '@/service/student/login';
import { useRequest } from 'ahooks';
import { useUserStore } from '@/store/useUserStore';
import { setToken } from '@/utils/utils';
import { useRoleStore } from '@/store/useRoleStore';
import { ROLE, ROLE_PATH_MAP } from '@/constants/role';
import { getCaptcha } from '@/service/common/common';

interface LoginForm {
    student_no: string;
    password: string;
    captcha_key: string;
    captcha_code: string;
}

const Login: React.FC = () => {
    const [form] = Form.useForm();
    const setUser = useUserStore((state) => state.setUser);
    const setRole = useRoleStore((state) => state.setRole);
    const [captchaImage, setCaptchaImage] = useState<string>('');
    const [captchaKey, setCaptchaKey] = useState<string>('');
    const { run, loading } = useRequest(fetchStudentLogin, {
        manual: true,
        debounceWait: 1000,
        onSuccess(res: any) {
            if (res.code === 200) {
                if (res.data.role !== ROLE.STUDENT) {
                    message.error('无效的用户类型');
                    return;
                }
                setUser(res.data);
                setRole(res.data.role);
                setToken(res.data.token);
                history.replace(ROLE_PATH_MAP[ROLE.STUDENT]);
                notification.success({
                    message: '登录成功!',
                    description: `欢迎回来！${res?.data?.user?.username}`,
                });
            }
        },
        onError(error: any) {
            message.error(error.message);
        }
    });

    const fetchCaptcha = async () => {
        try {
            const res = await getCaptcha();
            if (res.code === 200) {
                setCaptchaImage(res.data.image);
                setCaptchaKey(res.data.key);
                form.setFieldsValue({ captcha_key: res.data.key });
            }
        } catch (error) {
            message.error('获取验证码失败');
        }
    };

    useEffect(() => {
        fetchCaptcha();
    }, []);

    const onFinish = async (values: LoginForm) => {
        if (!captchaKey) {
            message.error('请先获取验证码');
            return;
        }
        values.captcha_key = captchaKey;
        run(values);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <div className={styles.loginHeader}>
                    <h1 className={styles.title}>应届生去向管理系统</h1>
                    <p className={styles.subtitle}>欢迎您的到来！</p>
                </div>

                <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                    <Form
                        form={form}
                        name="login"
                        onFinish={onFinish}
                        className={styles.loginForm}
                    >
                        <Form.Item
                            name="student_no"
                            rules={[
                                { required: true, message: '请输入学号' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className={styles.inputIcon} />}
                                placeholder="请输入学号"
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
                        <Form.Item
                            name="captcha_code"
                            rules={[
                                { required: true, message: '请输入验证码' }
                            ]}
                        >
                            <Row gutter={8}>
                                <Col span={16}>
                                    <Input
                                        prefix={<SafetyCertificateOutlined className={styles.inputIcon} />}
                                        placeholder="请输入验证码"
                                        size="large"
                                        disabled={loading}
                                        className={styles.input}
                                    />
                                </Col>
                                <Col span={8}>
                                    <img
                                        src={captchaImage}
                                        alt="验证码"
                                        onClick={fetchCaptcha}
                                        style={{ cursor: 'pointer', height: '40px' }}
                                    />
                                </Col>
                            </Row>
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
                                {loading ? '登录中...' : '学生登录'}
                            </Button>
                        </Form.Item>

                        <div className={styles.extraLinks}>
                            <Button
                                type="link"
                                onClick={() => history.replace('/student/register')}
                                className={styles.linkButton}
                            >
                                学生注册
                            </Button>
                            <Button
                                type="link"
                                onClick={() => history.replace('/teacher/login')}
                                className={styles.linkButton}
                            >
                                教职工登录
                            </Button>
                        </div>
                    </Form>
                </Spin>
            </div>
        </div>
    );
};

export default Login;