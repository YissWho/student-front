import React from 'react';
import { Button, Card, Result } from 'antd';
import { history } from 'umi';

const Permission: React.FC = () => {
    return (
        <Card>
            <Result
                status="403"
                title="403"
                subTitle="抱歉，您没有权限访问该页面"
                extra={
                    <Button
                        type="primary"
                        onClick={() => history.back()}
                    >
                        返回
                    </Button>
                }
            />
        </Card>
    );
};

export default Permission;
