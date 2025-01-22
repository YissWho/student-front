import React, { useState } from "react"
import {
  Table,
  Card,
  Space,
  Typography,
  Tag,
  Progress,
  Button,
  Tooltip,
  message,
} from "antd"
import { useRequest } from "ahooks"
import { getTeacherSurveys } from "@/service/teacher/mange/survey"
import { EyeOutlined } from "@ant-design/icons"
import DetailModal from "./detailModal"
import StudentDetailModal from "./studentDetailModal"

const { Title, Text } = Typography

interface Survey {
  id: number
  title: string
  description: string
  is_active: boolean
  is_default: boolean
  start_time: string | null
  end_time: string | null
  status: string
  completed_count: number
  uncompleted_count: number
  total_count: number
  completion_rate: number
}

const Surveys: React.FC = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [studentDetailModalVisible, setStudentDetailModalVisible] =
    useState(false)
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  )
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // 获取问卷列表
  const { data, loading, refresh } = useRequest(
    () =>
      getTeacherSurveys({
        page: currentPage,
        page_size: pageSize,
      }),
    {
      refreshDeps: [currentPage],
      onError: () => {
        message.error("获取问卷列表失败")
      },
    }
  )

  const surveys: Survey[] = data?.data?.list || []
  const total = data?.data?.count || 0

  // 查看问卷详情
  const handleViewDetail = (record: Survey) => {
    setSelectedSurvey(record)
    setDetailModalVisible(true)
  }

  // 查看学生详情
  const handleViewStudentDetail = (studentId: number) => {
    setSelectedStudentId(studentId)
    setStudentDetailModalVisible(true)
  }

  const columns = [
    {
      title: "问卷标题",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "进行中" ? "processing" : "default"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "完成情况",
      key: "completion",
      render: (_: any, record: Survey) => (
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Progress
            percent={record.completion_rate}
            size="small"
            status={record.completion_rate === 100 ? "success" : "active"}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            已完成: {record.completed_count}/{record.total_count}
          </Text>
        </Space>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Survey) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Title level={4}>问卷管理</Title>

        <Table
          columns={columns}
          dataSource={surveys}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page) => setCurrentPage(page),
            showTotal: (total) => `共 ${total} 条问卷`,
          }}
        />

        {/* 问卷详情弹窗 */}
        {selectedSurvey && (
          <DetailModal
            visible={detailModalVisible}
            survey={selectedSurvey}
            onClose={() => {
              setDetailModalVisible(false)
              setSelectedSurvey(null)
            }}
            onViewStudentDetail={handleViewStudentDetail}
          />
        )}

        {/* 学生问卷详情弹窗 */}
        {selectedStudentId && selectedSurvey && (
          <StudentDetailModal
            visible={studentDetailModalVisible}
            surveyId={selectedSurvey.id}
            student_no={selectedStudentId}
            onClose={() => {
              setStudentDetailModalVisible(false)
              setSelectedStudentId(null)
            }}
          />
        )}
      </Space>
    </Card>
  )
}

export default Surveys
