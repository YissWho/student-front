import {
  addNotice,
  AddNoticeParams,
  updateNotice,
} from "@/service/teacher/mange/notice"
import { useRequest } from "ahooks"
import { Form, Input, message as antdMessage, Modal } from "antd"
import { useEffect } from "react"
interface NoticeModalProps {
  open: boolean
  onCancel: () => void
  isEdit: boolean
  initialValues: any
  record?: any
  onSuccess: () => void
}
export const NoticeModal: React.FC<NoticeModalProps> = ({
  open,
  onCancel,
  isEdit,
  initialValues,
  record,
  onSuccess,
}) => {
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = antdMessage.useMessage()
  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues)
    }
  }, [initialValues, open])
  const handleCancel = () => {
    onCancel()
    form.resetFields()
  }
  const { run } = useRequest(
    async (params: AddNoticeParams) => {
      if (isEdit) {
        return updateNotice(record.id, params)
      }
      return addNotice(params)
    },
    {
      manual: true,
      onSuccess: (res) => {
        if (res.code === 200) {
          messageApi.success(res.message)
          onSuccess()
        }
      },
    }
  )
  const handleOk = () => {
    form.validateFields().then((values) => {
      run(values)
    })
  }
  return (
    <div>
      {contextHolder}
      <Modal
        open={open}
        onCancel={handleCancel}
        title={isEdit ? "编辑通知" : "发布通知"}
        onOk={handleOk}
      >
        <Form form={form}>
          <Form.Item
            name="title"
            label="通知标题"
            rules={[{ required: true, message: "请输入通知标题" }]}
          >
            <Input placeholder="请输入通知标题" />
          </Form.Item>
          <Form.Item
            name="content"
            label="通知内容"
            rules={[{ required: true, message: "请输入通知内容" }]}
          >
            <Input.TextArea placeholder="请输入通知内容" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
