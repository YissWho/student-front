import React from 'react';
import { Form, Input, Button, message, Spin, notification } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';
import { fetchStudentLogin } from '@/service/student/login';
import { useRequest } from 'ahooks';
import { useUserStore } from '@/store/useUserStore';
import { setToken } from '@/utils/utils';
import { useRoleStore } from '@/store/useRoleStore';
import { ROLE, ROLE_PATH_MAP } from '@/constants/role';

interface LoginForm {
  student_no: string;
  password: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const setUser = useUserStore((state) => state.setUser);
  const setRole = useRoleStore((state) => state.setRole);
  const { run, loading } = useRequest(fetchStudentLogin, {
    manual: true,
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

  const onFinish = async (values: LoginForm) => {
    run(values);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginHeader}>
          <h1 className={styles.title}>应届生去向系统</h1>
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