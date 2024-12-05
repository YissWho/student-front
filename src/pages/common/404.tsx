import React from 'react';
import { Button, Card, Result } from 'antd';
import { history } from 'umi';

const NotFound: React.FC = () => {
    return (
        <Card>
            <Result
                status="404"
                title="404"
                subTitle="抱歉，您访问的页面不存在"
                extra={
                    <Button
                        type="primary"
                        onClick={() => history.back()}
                    >
                        返回首页
                    </Button>
                }
            />
        </Card>
    );
};

export default NotFound;
