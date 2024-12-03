import React, { useState } from 'react';
import { Form, Input, Button, Select, message, notification } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { useRequest } from 'ahooks';
import { fetchStudentRegister } from '@/service/student/register';
import { getTeachers, getTeacherClasses } from '@/service/common/common';
import styles from './index.less';

interface RegisterForm {
    student_no: string;
    username: string;
    phone: string;
    password: string;
    confirm_password: string;
    classs: string;
    teacher: string;
}

const Register: React.FC = () => {
    const [form] = Form.useForm();
    const [selectedTeacher, setSelectedTeacher] = useState<string>('');

    // 获取老师列表
    const { data: teachersData } = useRequest(getTeachers);
    const teachers = teachersData?.data || [];

    // 获取选中老师的班级列表
    const { data: classesData, run: fetchClasses } = useRequest(
        (teacherId: string) => getTeacherClasses(teacherId),
        {
            manual: true,
        }
    );
    const classes = classesData?.data || [];

    const { loading: registering, run: register } = useRequest(fetchStudentRegister, {
        manual: true,
        onSuccess: (res: any) => {
            if (res.code === 200) {
                notification.success({
                    message: '注册成功',
                    description: '请使用学号和密码登录',
                });
                history.replace('/login');
            }
        },
        onError: (error: any) => {
            // 处理注册失败的情况
            message.error(error.message || '注册失败，请重试');
        }
    });

    // 处理老师选择变化
    const handleTeacherChange = (value: string) => {
        setSelectedTeacher(value);
        form.setFieldValue('classs', undefined); // 清空已选择的班级
        fetchClasses(value);
    };

    // 处理表单提交
    const onFinish = async (values: RegisterForm) => {
        if (values.password !== values.confirm_password) {
            message.error('两次输入的密码不一致');
            return;
        }
        const { teacher, ...registerData } = values;
        register(registerData);
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerBox}>
                <div className={styles.registerHeader}>
                    <h1 className={styles.title}>应届生去向系统</h1>
                    <p className={styles.subtitle}>新用户注册</p>
                </div>

                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    className={styles.registerForm}
                    layout="vertical"
                >
                    <Form.Item
                        name="student_no"
                        rules={[
                            { required: true, message: '请输入学号' },
                            { pattern: /^\d+$/, message: '学号必须为数字' }
                        ]}
                    >
                        <Input
                            prefix={<IdcardOutlined />}
                            placeholder="学号"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: '请输入姓名' },
                            { min: 2, message: '姓名至少2个字符' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="姓名"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        rules={[
                            { required: true, message: '请输入手机号' },
                            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                        ]}
                    >
                        <Input
                            prefix={<PhoneOutlined />}
                            placeholder="手机号"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="teacher"
                        rules={[{ required: true, message: '请选择老师' }]}
                    >
                        <Select
                            placeholder="请选择老师"
                            onChange={handleTeacherChange}
                            size="large"
                            options={teachers.map((teacher: any) => ({
                                label: teacher.name,
                                value: teacher.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="classs"
                        rules={[{ required: true, message: '请选择班级' }]}
                    >
                        <Select
                            placeholder="请选择班级"
                            size="large"
                            disabled={!selectedTeacher}
                            options={classes.map((cls: any) => ({
                                label: cls.name,
                                value: cls.id
                            }))}
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
                            prefix={<LockOutlined />}
                            placeholder="密码"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirm_password"
                        rules={[
                            { required: true, message: '请确认密码' },
                            { min: 6, message: '密码至少6位' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="确认密码"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={registering}
                        >
                            注册
                        </Button>
                    </Form.Item>

                    <div className={styles.extraLinks}>
                        <Button type="link" onClick={() => history.replace('/login')}>
                            返回登录
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Register;
