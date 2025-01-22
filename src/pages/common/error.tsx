import React from "react"
import { Button, Card, Result } from "antd"
import { history } from "umi"

const Error: React.FC = () => {
  return (
    <Card>
      <Result
        status="500"
        title="500"
        subTitle="抱歉，服务器出现了错误"
        extra={
          <Button type="primary" onClick={() => history.back}>
            返回首页
          </Button>
        }
      />
    </Card>
  )
}

export default Error
