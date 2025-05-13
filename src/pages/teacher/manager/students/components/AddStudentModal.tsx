import React, { useState } from "react"
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Space,
  Avatar,
  Steps,
} from "antd"
import {
  UserOutlined,
  IdcardOutlined,
  PhoneOutlined,
  UploadOutlined,
  TeamOutlined,
  LoadingOutlined,
} from "@ant-design/icons"
import { useRequest } from "ahooks"
import { addTeacherStudent } from "@/service/teacher/mange/students"
import styles from "./AddStudentModal.less"
import classNames from "classnames"

interface AddStudentModalProps {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
  classes: any[]
}

/* 该组件已被弃用 */
const AddStudentModal: React.FC<AddStudentModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  classes,
}) => {
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  // 添加学生请求
  const { loading, run } = useRequest(addTeacherStudent, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.code === 200) {
        message.success("添加学生成功")
        onSuccess()
        handleCancel()
      }
    },
  })

  // 处理取消
  const handleCancel = () => {
    setCurrentStep(0)
    setAvatarFile(null)
    setPreviewUrl("")
    form.resetFields()
    onCancel()
  }

  // 处理提交
  const handleFinish = async () => {
    try {
      const values = await form.validateFields()
      const formData = new FormData()
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined) {
          formData.append(key, values[key])
        }
      })
      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }
      run(formData)
    } catch (error) {
      console.error("Validation failed:", error)
    }
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

  const steps = [
    {
      title: "基本信息",
      content: (
        <div className={styles.stepContent}>
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
        </div>
      ),
    },
    {
      title: "班级信息",
      content: (
        <div className={styles.stepContent}>
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
        </div>
      ),
    },
    {
      title: "头像上传",
      content: (
        <div className={classNames(styles.stepContent, styles.uploadStep)}>
          <div className={styles.avatarPreview}>
            <Avatar
              size={120}
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
                <div>点击上传头像</div>
              </div>
            </Upload>
          </div>
        </div>
      ),
    },
  ]

  return (
    <Modal
      title="添加学生"
      open={visible}
      onCancel={handleCancel}
      width={600}
      className={styles.modal}
      footer={null}
      centered
    >
      <Steps current={currentStep} items={steps} className={styles.steps} />
      <Form form={form} layout="vertical" className={styles.form}>
        {steps[currentStep].content}

        <div className={styles.buttons}>
          {currentStep > 0 && (
            <button
              className={styles.prevButton}
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              上一步
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button
              className={styles.nextButton}
              onClick={() => setCurrentStep((prev) => prev + 1)}
            >
              下一步
            </button>
          )}
          {currentStep === steps.length - 1 && (
            <button
              className={styles.submitButton}
              onClick={handleFinish}
              disabled={loading}
            >
              {loading ? <LoadingOutlined /> : "完成"}
            </button>
          )}
        </div>
      </Form>
    </Modal>
  )
}

export default AddStudentModal
