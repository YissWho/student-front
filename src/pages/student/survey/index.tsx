import React, { useEffect, useState } from "react"
import {
  Card,
  Typography,
  Tag,
  Empty,
  Spin,
  Result,
  Button,
  List,
  message,
} from "antd"
import { useRequest } from "ahooks"
import { getSurveyList } from "@/service/student/survey"
import { motion } from "framer-motion"
import {
  FormOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CrownOutlined,
} from "@ant-design/icons"
import styles from "./index.less"
import SurveyForm from "./components/SurveyForm"

const { Title, Text } = Typography

interface Survey {
  id: number
  title: string
  is_default: boolean
  status: string
  has_submitted: boolean
}

const Survey: React.FC = () => {
  // 使用 useEffect 处理全局刷新事件
  useEffect(() => {
    const handleRefresh = () => {
      refresh()
      message.success("刷新成功", 1)
    }

    window.addEventListener("refreshSurvey", handleRefresh)

    // 组件初始化时执行一次查询
    refresh()

    return () => {
      window.removeEventListener("refreshSurvey", handleRefresh)
    }
  }, [])
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)
  const [formVisible, setFormVisible] = useState(false)

  const { data, loading, error, refresh } = useRequest(getSurveyList)

  const handleFormSuccess = () => {
    setFormVisible(false)
    setSelectedSurvey(null)
    refresh()
  }

  if (error) {
    return <Result status="error" title="获取问卷失败" subTitle="请稍后重试" />
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  const surveys = data?.data?.available_surveys || []

  if (surveys.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无问卷" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 3,
        }}
        dataSource={surveys}
        renderItem={(survey: Survey, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <List.Item>
              <Card
                className={styles.surveyCard}
                hoverable
                title={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FormOutlined
                      style={{ fontSize: "24px", color: "#1890ff" }}
                    />
                    <Title level={4} style={{ margin: 0 }}>
                      {survey.title}
                    </Title>
                    {survey.is_default && (
                      <CrownOutlined
                        style={{ color: "#faad14", fontSize: "20px" }}
                      />
                    )}
                  </div>
                }
              >
                <div className={styles.cardContent}>
                  <div className={styles.surveyInfo}>
                    <Text type="secondary">问卷编号: {survey.id}</Text>
                    {survey.is_default && <Tag color="gold">默认问卷</Tag>}
                  </div>

                  <div className={styles.statusSection}>
                    <div className={styles.tags}>
                      <Tag
                        color={survey.has_submitted ? "#87d068" : "#2db7f5"}
                        icon={
                          survey.has_submitted ? (
                            <CheckCircleOutlined />
                          ) : (
                            <ClockCircleOutlined />
                          )
                        }
                      >
                        {survey.has_submitted ? "已提交" : "未提交"}
                      </Tag>
                      <Tag color="blue">{survey.status}</Tag>
                    </div>

                    {!survey.has_submitted && (
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                          setSelectedSurvey(survey)
                          setFormVisible(true)
                        }}
                      >
                        填写问卷
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </List.Item>
          </motion.div>
        )}
      />

      {selectedSurvey && (
        <SurveyForm
          visible={formVisible}
          surveyId={selectedSurvey.id}
          onCancel={() => {
            setFormVisible(false)
            setSelectedSurvey(null)
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </motion.div>
  )
}

export default Survey
