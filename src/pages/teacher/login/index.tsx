import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin, notification, Col, Row } from 'antd';
import { PhoneOutlined, LockOutlined, SafetyCertificateOutlined, LoadingOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';
import { login } from '@/service/teacher/login';
import { useRequest } from 'ahooks';
import { useUserStore } from '@/store/useUserStore';
import { setToken } from '@/utils/utils';
import { useRoleStore } from '@/store/useRoleStore';
import { ROLE, ROLE_PATH_MAP } from '@/constants/role';
import { useTeacherStore } from '@/store/useTeacherStore';
import { getCaptcha } from '@/service/common/common';

interface LoginForm {
    phone: string;
    password: string;
    captcha_key: string;
    captcha_code: string;
}

const TeacherLogin: React.FC = () => {
    const [form] = Form.useForm();
    const setUserInfo = useTeacherStore((state) => state.setUserInfo);
    const setRole = useRoleStore((state) => state.setRole);
    const [captchaImage, setCaptchaImage] = useState('');
    const [captchaKey, setCaptchaKey] = useState('');
    useEffect(() => {
        fetchCaptcha();
    }, []);
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

    const { run, loading } = useRequest(login, {
        manual: true,
        debounceWait: 1000,
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
            fetchCaptcha();
            message.error(error.message || '登录失败，请重试');
        }
    });

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