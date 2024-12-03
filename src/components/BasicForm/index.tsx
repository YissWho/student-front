import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import React from 'react';
import { BasicFormProps, FormField } from './types';
import moment from 'moment';

const { RangePicker } = DatePicker;

const BasicForm: React.FC<BasicFormProps> = ({
    onSearch,
    onReset,
    loading,
    fields = [],
    extraButtons,
}) => {
    const [form] = Form.useForm();

    // 处理表单提交
    const handleFinish = (values: any) => {
        // 格式化表单值
        // 使用reduce遍历所有表单字段,处理不同类型的日期格式
        const formattedValues = Object.keys(values).reduce((acc, key) => {
            // 查找当前字段的配置信息
            const field = fields.find(f => f.name === key);
            // 如果没有找到字段配置,直接返回原始值
            if (!field) return { ...acc, [key]: values[key] };

            // 处理单个日期选择器的值,格式化为YYYYMMDD
            if (field.type === 'datePicker' && values[key]) {
                return {
                    ...acc,
                    [key]: moment(values[key]).format('YYYYMMDD')
                };
            }

            // 处理日期范围选择器的值,格式化为YYYY-MM-DD HH:mm:ss
            if (field.type === 'rangePicker' && values[key]) {
                return {
                    ...acc,
                    [key]: [
                        moment(values[key][0]).format('YYYY-MM-DD HH:mm:ss'),
                        moment(values[key][1]).format('YYYY-MM-DD HH:mm:ss')
                    ]
                };
            }

            // 其他类型字段直接返回原始值
            return { ...acc, [key]: values[key] };
        }, {});
        onSearch(formattedValues);
    };

    // 处理表单重置
    const handleReset = () => {
        form.resetFields();
        onReset && onReset();
    };

    // 渲染不同类型的表单控件
    const renderFormControl = (field: FormField) => {
        switch (field.type) {
            case 'input':
                return (
                    <Input
                        placeholder={`请输入${field.label}`}
                        allowClear
                    />
                );
            case 'select':
                return (
                    <Select
                        style={{ width: 150 }}
                        placeholder={`请选择${field.label}`}
                        allowClear
                        options={field.options}
                        loading={field.loading}
                    />
                );
            case 'datePicker':
                return (
                    <DatePicker
                        style={{ width: 150 }}
                        format="YYYY-MM-DD"
                    />
                );
            case 'rangePicker':
                return (
                    <RangePicker
                        style={{ width: 360 }}
                        showTime={field.showTime}
                        format={field.showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Form
            form={form}
            layout="inline"
            onFinish={handleFinish}
        >
            {fields.map(field => (
                <Form.Item
                    key={field.name}
                    name={field.name}
                    label={field.label}
                >
                    {renderFormControl(field)}
                </Form.Item>
            ))}

            <Form.Item>
                <Space>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        查询
                    </Button>
                    <Button onClick={handleReset}>
                        重置
                    </Button>
                    {extraButtons}
                </Space>
            </Form.Item>
        </Form>
    );
};

export default BasicForm; 