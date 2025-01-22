import {
  updateTeacherClass,
  addTeacherClass,
} from "@/service/teacher/mange/classes"
import { useRequest } from "ahooks"
import { Form, message, Modal, Input } from "antd"
import React from "react"
import styles from "./index.less"
interface ClassFormModalProps {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
  initialValues?: any
  title: string
}

// 班级表单模态框组件
export const ClassFormModal: React.FC<ClassFormModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  initialValues,
  title,
}) => {
  const [form] = Form.useForm()
  const isEdit = !!initialValues

  const { loading, run } = useRequest(
    async (values) => {
      if (isEdit) {
        return updateTeacherClass(initialValues.id, values)
      }
      return addTeacherClass(values)
    },
    {
      manual: true,
      onSuccess: (res: any) => {
        if (res.code === 200) {
          message.success(isEdit ? "修改成功" : "添加成功")
          onSuccess()
          form.resetFields()
        }
      },
    }
  )

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues)
    } else {
      form.resetFields()
    }
  }, [visible, initialValues, form])

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      className={styles.formModal}
    >
      <Form form={form} layout="vertical" onFinish={run}>
        <Form.Item
          name="name"
          label="班级名称"
          rules={[
            { required: true, message: "请输入班级名称" },
            { min: 2, message: "班级名称至少2个字符" },
          ]}
        >
          <Input placeholder="请输入班级名称" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
