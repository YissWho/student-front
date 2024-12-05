import React from 'react';
import { Modal, Descriptions, Typography, Spin, Empty } from 'antd';
import { useRequest } from 'ahooks';
import { getTeacherSurveyStudentDetail } from '@/service/teacher/mange/survey';
import dayjs from 'dayjs';

const { Title } = Typography;

interface StudentDetailModalProps {
    visible: boolean;
    surveyId: number;
    student_no: number;
    onClose: () => void;
}

interface SurveyResponse {
    id: number;
    student_name: string;
    name: string;
    student_no: string;
    class_name: string;
    phone: string;
    future_plan: number;
    future_plan_display: string;
    employment_type: number;
    employment_type_display: string;
    city_preference: number;
    city_preference_display: string;
    expected_salary: number;
    expected_salary_display: string;
    job_market_view: number;
    job_market_view_display: string;
    study_type: number | null;
    study_type_display: string | null;
    target_school: string | null;
    study_plan_status: number | null;
    study_plan_status_display: string | null;
    submitted_at: string;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
    visible,
    surveyId,
    student_no,
    onClose
}) => {
    // 获取学生问卷详情
    const { data, loading } = useRequest(
        () => getTeacherSurveyStudentDetail(surveyId, student_no),
        {
            ready: visible && surveyId > 0 && student_no > 0,
            refreshDeps: [surveyId, student_no]
        }
    );

    const response: SurveyResponse = data?.data?.response;

    if (!response) {
        return (
            <Modal
                title="问卷详情"
                open={visible}
                onCancel={onClose}
                footer={null}
                width={600}
            >
                <Empty description="暂无数据" />
            </Modal>
        );
    }

    return (
        <Modal
            style={{ top: 30 }}
            title={
                <Title level={4}>
                    {response.student_name} 的问卷详情
                </Title>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" tip="加载中..." />
                </div>
            ) : (
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="姓名">{response.name}</Descriptions.Item>
                    <Descriptions.Item label="学号">{response.student_no}</Descriptions.Item>
                    <Descriptions.Item label="班级">{response.class_name}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{response.phone}</Descriptions.Item>
                    <Descriptions.Item label="就业意向">{response.future_plan_display}</Descriptions.Item>
                    {response.future_plan === 0 && (
                        <>
                            <Descriptions.Item label="就业类型">{response.employment_type_display}</Descriptions.Item>
                            <Descriptions.Item label="城市偏好">{response.city_preference_display}</Descriptions.Item>
                            <Descriptions.Item label="期望薪资">{response.expected_salary_display}</Descriptions.Item>
                            <Descriptions.Item label="就业前景看法">{response.job_market_view_display}</Descriptions.Item>
                        </>
                    )}
                    {response.future_plan === 1 && (
                        <>
                            <Descriptions.Item label="考研类型">{response.study_type_display}</Descriptions.Item>
                            <Descriptions.Item label="目标院校">{response.target_school}</Descriptions.Item>
                            <Descriptions.Item label="备考情况">{response.study_plan_status_display}</Descriptions.Item>
                        </>
                    )}
                    <Descriptions.Item label="提交时间">
                        {dayjs(response.submitted_at).format('YYYY-MM-DD HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Modal>
    );
};

export default StudentDetailModal; 