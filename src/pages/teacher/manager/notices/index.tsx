import React, { useEffect, useState } from "react"
import {
  Space,
  Input,
  Button,
  Table,
  Tag,
  Typography,
  Tooltip,
  Badge,
  message,
} from "antd"
import { ProCard } from "@ant-design/pro-components"
import { useRequest } from "ahooks"
import { fetchNoticeList } from "@/service/teacher/mange/notice"
import {
  NotificationOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import styles from "./index.less"
import { NoticeModal } from "./modal"
import { DetailModal } from "./detailModal"
import { Modal as AntdModal } from "antd"
import { deleteNotice } from "@/service/teacher/mange/notice"

const { Title, Text } = Typography

const Notices: React.FC = () => {
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [noticeModalOpen, setNoticeModalOpen] = useState({
    open: false,
    record: null,
  })
  const [isEdit, setIsEdit] = useState(false)
  const [initialValues, setInitialValues] = useState({})
  const pageSize = 10
  const [detailModalOpen, setDetailModalOpen] = useState({
    open: false,
    record: null,
  })

  // 获取通知列表
  const { data, loading, refresh } = useRequest(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return fetchNoticeList({
        page: currentPage,
        page_size: pageSize,
        search: searchText,
      })
    },
    {
      refreshDeps: [currentPage, searchText],
      debounceWait: 500,
    }
  )

  const notices = data?.data.results || []
  const total = data?.data.count || 0

  // 删除通知
  const { run: handleDelete } = useRequest(deleteNotice, {
    manual: true,
    onSuccess: (res) => {
      if (res.code === 200) {
        message.success("删除成功")
        refresh()
      }
    },
  })

  const confirmDelete = (record: any) => {
    AntdModal.confirm({
      title: "确认删除",
      content: "确定要删除这条通知吗？删除后将无法恢复。",
      okText: "确认",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: () => handleDelete(record.id),
    })
  }

  const handleEdit = (record: any) => {
    setNoticeModalOpen({ open: true, record })
    setIsEdit(!!record)
    setInitialValues(record)
  }

  const handleSuccess = () => {
    setNoticeModalOpen({ open: false, record: null })
    setInitialValues({})
    setIsEdit(false)
    refresh()
  }

  const columns = [
    {
      title: "通知标题",
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (text: string) => (
        <Space>
          <NotificationOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "通知内容",
      dataIndex: "content",
      key: "content",
      width: 500,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: "发布时间",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => (
        <Text type="secondary">{dayjs(text).format("YYYY-MM-DD HH:mm")}</Text>
      ),
    },
    {
      title: "操作",
      flex: "right",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              className={styles.actionButton}
              onClick={() => setDetailModalOpen({ open: true, record })}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              className={styles.actionButton}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              className={styles.actionButton}
              onClick={() => confirmDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  // 监听刷新事件
  useEffect(() => {
    const handleRefresh = () => {
      refresh()
    }

    window.addEventListener("refreshNotices", handleRefresh)
    return () => {
      window.removeEventListener("refreshNotices", handleRefresh)
    }
  }, [refresh])

  return (
    <div className={styles.noticesContainer}>
      <ProCard className={styles.tableCard}>
        <div className={styles.header}>
          <Title level={4}>
            <NotificationOutlined /> 通知管理
          </Title>
          <Space size="middle">
            <Input
              placeholder="搜索通知标题"
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleEdit(null)}
            >
              发布通知
            </Button>
          </Space>
        </div>

        <Table
          className={styles.table}
          columns={columns}
          dataSource={notices}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page) => setCurrentPage(page),
            showTotal: (total) => `共 ${total} 条通知`,
          }}
        />

        <NoticeModal
          open={noticeModalOpen.open}
          onCancel={() => {
            setNoticeModalOpen({ open: false, record: null })
            setInitialValues({})
            setIsEdit(false)
          }}
          isEdit={isEdit}
          initialValues={initialValues}
          record={noticeModalOpen.record}
          onSuccess={handleSuccess}
        />

        <DetailModal
          open={detailModalOpen.open}
          onCancel={() => setDetailModalOpen({ open: false, record: null })}
          record={detailModalOpen.record}
        />
      </ProCard>
    </div>
  )
}

export default Notices
