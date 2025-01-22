import React, { useEffect, useState } from "react"
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Space,
  Avatar,
} from "antd"
import {
  UserOutlined,
  IdcardOutlined,
  PhoneOutlined,
  UploadOutlined,
} from "@ant-design/icons"
import { useRequest } from "ahooks"
import {
  addTeacherStudent,
  updateTeacherStudent,
} from "@/service/teacher/mange/students"
import styles from "./StudentFormModal.less"
import { BASE_URL } from "@/config"

interface StudentFormModalProps {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
  classes: any[]
  editData?: any // 编辑时的初始数据
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  classes,
  editData,
}) => {
  const [form] = Form.useForm()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const isEdit = !!editData

  // 设置初始值
  useEffect(() => {
    if (visible && editData) {
      form.setFieldsValue({
        student_no: editData.student_no,
        username: editData.username,
        phone: editData.phone,
        classs: editData.classs,
      })
      setPreviewUrl(`${BASE_URL}/${editData.avatar}`)
    } else {
      form.resetFields()
      setPreviewUrl("")
      setAvatarFile(null)
    }
  }, [visible, editData, form])

  // 提交请求
  const { loading, run } = useRequest(
    async (values) => {
      const formData = new FormData()

      // 添加所有表单字段到 FormData
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && key !== "avatar") {
          formData.append(key, values[key])
        }
      })

      // 如果有新的头像文件，添加到 FormData
      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }

      // 根据是否是编辑模式调用不同的接口
      if (isEdit) {
        return updateTeacherStudent(editData.id, formData)
      }
      return addTeacherStudent(formData)
    },
    {
      manual: true,
      onSuccess: (res: any) => {
        if (res.code === 200) {
          message.success(isEdit ? "修改成功" : "添加成功")
          onSuccess()
          handleCancel()
        }
      },
    }
  )

  // 处理取消
  const handleCancel = () => {
    form.resetFields()
    setAvatarFile(null)
    setPreviewUrl("")
    onCancel()
  }

  // 处理头像上传
  const handleAvatarChange = (file: File) => {
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    return false
  }

  return (
    <Modal
      title={isEdit ? "编辑学生" : "添加学生"}
      style={{ top: 20 }}
      open={visible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={520}
      className={styles.modal}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={run}
        className={styles.form}
      >
        <div className={styles.avatarSection}>
          <Avatar
            size={80}
            src={previewUrl}
            icon={<UserOutlined />}
            className={styles.avatar}
          />
          <Upload
            showUploadList={false}
            beforeUpload={handleAvatarChange}
            accept="image/*"
          >
            <div className={styles.uploadButton}>
              <UploadOutlined />
              <span>更换头像</span>
            </div>
          </Upload>
        </div>

        <Form.Item
          name="student_no"
          rules={[
            { required: true, message: "请输入学号" },
            { pattern: /^\d+$/, message: "学号必须为数字" },
          ]}
        >
          <Input
            prefix={<IdcardOutlined />}
            placeholder="学号"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item
          name="username"
          rules={[
            { required: true, message: "请输入姓名" },
            { min: 2, message: "姓名至少2个字符" },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="姓名"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[
            { required: true, message: "请输入手机号" },
            { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="手机号"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item
          name="classs"
          rules={[{ required: true, message: "请选择班级" }]}
        >
          <Select
            placeholder="选择班级"
            className={styles.select}
            options={classes.map((cls) => ({
              label: cls.name,
              value: cls.id,
            }))}
          />
        </Form.Item>

        {!isEdit && (
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入初始密码" },
              { min: 6, message: "密码至少6位" },
            ]}
          >
            <Input.Password
              placeholder="设置初始密码"
              className={styles.input}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default StudentFormModal
