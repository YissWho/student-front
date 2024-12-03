import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import ClassDistribution from './components/ClassDistribution';
import EmploymentTrend from './components/EmploymentTrend';
import styles from './index.less';
import EmploymentRatio from './components/EmploymentRatio';
import ProvinceWordCloud from './components/ProvinceWordCloud';

const BasicEcharts: React.FC = () => {
    // 创建一个刷新事件处理函数
    const handleRefresh = () => {
        // 触发所有图表组件的刷新
        window.dispatchEvent(new CustomEvent('refreshClassDistribution'));
        window.dispatchEvent(new CustomEvent('refreshEmploymentTrend'));
        window.dispatchEvent(new CustomEvent('refreshEmploymentRatio'));
        window.dispatchEvent(new CustomEvent('refreshProvinceCloud'));
    };

    // 监听父组件的刷新事件
    useEffect(() => {
        window.addEventListener('refreshBasic', handleRefresh);
        return () => {
            window.removeEventListener('refreshBasic', handleRefresh);
        };
    }, []);

    return (
        <div className={styles.container}>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <ClassDistribution />
                </Col>
                <Col span={12}>
                    <EmploymentTrend />
                </Col>
                <Col span={12}>
                    <EmploymentRatio />
                </Col>
                <Col span={12}>
                    <ProvinceWordCloud />
                </Col>
            </Row>
        </div>
    );
};

export default BasicEcharts;
