import React from "react"
import { Modal, Form, Select, Input, message } from "antd"
import { submitSurvey } from "@/service/student/survey"
import {
  PLAN_CHOICES,
  EMPLOYMENT_TYPE_CHOICES,
  CITY_PREFERENCE_CHOICES,
  SALARY_RANGE_CHOICES,
  JOB_MARKET_VIEW_CHOICES,
  STUDY_TYPE_CHOICES,
  STUDY_PLAN_STATUS_CHOICES,
} from "@/constants/survey"
import { motion } from "framer-motion"

interface SurveyFormProps {
  visible: boolean
  surveyId: number
  onCancel: () => void
  onSuccess: () => void
}

const SurveyForm: React.FC<SurveyFormProps> = ({
  visible,
  surveyId,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = React.useState(false)

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true)
      const submitData = {
        survey_id: surveyId,
        ...values,
      }
      const res = await submitSurvey(submitData)
      if (res.code === 200) {
        message.success("问卷提交成功")
        form.resetFields()
        onSuccess()
      }
    } catch (error) {
      message.error("提交失败，请重试")
    } finally {
      setSubmitting(false)
    }
  }

  // 表单项的动画配置
  const formItemAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  }

  return (
    <Modal
      title="填写就业去向调查问卷"
      open={visible}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={form.submit}
      confirmLoading={submitting}
      width={600}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark="optional"
      >
        <motion.div {...formItemAnimation}>
          <Form.Item
            name="future_plan"
            label="毕业去向"
            rules={[{ required: true, message: "请选择毕业去向" }]}
          >
            <Select placeholder="请选择">
              {PLAN_CHOICES.map(([value, label]) => (
                <Select.Option key={value} value={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </motion.div>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.future_plan !== currentValues.future_plan
          }
        >
          {({ getFieldValue }) => {
            const futurePlan = getFieldValue("future_plan")

            if (futurePlan === 0) {
              // 就业
              return (
                <>
                  <motion.div {...formItemAnimation}>
                    <Form.Item
                      name="employment_type"
                      label="就业方式"
                      rules={[{ required: true, message: "请选择就业方式" }]}
                    >
                      <Select placeholder="请选择">
                        {EMPLOYMENT_TYPE_CHOICES.map(([value, label]) => (
                          <Select.Option key={value} value={value}>
                            {label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </motion.div>

                  <motion.div {...formItemAnimation}>
                    <Form.Item
                      name="city_preference"
                      label="就业城市倾向"
                      rules={[
                        { required: true, message: "请选择就业城市倾向" },
                      ]}
                    >
                      <Select placeholder="请选择">
                        {CITY_PREFERENCE_CHOICES.map(([value, label]) => (
                          <Select.Option key={value} value={value}>
                            {label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </motion.div>

                  <motion.div {...formItemAnimation}>
                    <Form.Item
                      name="expected_salary"
                      label="期望月薪"
                      rules={[{ required: true, message: "请选择期望月薪" }]}
                    >
                      <Select placeholder="请选择">
                        {SALARY_RANGE_CHOICES.map(([value, label]) => (
                          <Select.Option key={value} value={value}>
                            {label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </motion.div>

                  <motion.div {...formItemAnimation}>
                    <Form.Item
                      name="job_market_view"
                      label="就业形势看法"
                      rules={[
                        { required: true, message: "请选择就业形势看法" },
                      ]}
                    >
                      <Select placeholder="请选择">
                        {JOB_MARKET_VIEW_CHOICES.map(([value, label]) => (
                          <Select.Option key={value} value={value}>
                            {label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </motion.div>
                </>
              )
            }

            if (futurePlan === 1) {
              // 升学
              return (
                <>
                  <motion.div {...formItemAnimation}>
                    <Form.Item
                      name="study_type"
                      label="升学方式"
                      rules={[{ required: true, message: "请选择升学方式" }]}
                    >
                      <Select placeholder="请选择">
                        {STUDY_TYPE_CHOICES.map(([value, label]) => (
                          <Select.Option key={value} value={value}>
                            {label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </motion.div>

                  <motion.div {...formItemAnimation}>
                    <Form.Item
                      name="target_school"
                      label="院校名称"
                      rules={[{ required: true, message: "请输入院校名称" }]}
                    >
                      <Input placeholder="请输入院校名称" />
                    </Form.Item>
                  </motion.div>

                  <motion.div {...formItemAnimation}>
                    <Form.Item
                      name="study_plan_status"
                      label="备考计划"
                      rules={[{ required: true, message: "请选择备考计划" }]}
                    >
                      <Select placeholder="请选择">
                        {STUDY_PLAN_STATUS_CHOICES.map(([value, label]) => (
                          <Select.Option key={value} value={value}>
                            {label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </motion.div>
                </>
              )
            }

            return null
          }}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SurveyForm
