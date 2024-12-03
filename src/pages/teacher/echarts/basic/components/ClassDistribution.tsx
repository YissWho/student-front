import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, Spin } from 'antd';
import { useRequest } from 'ahooks';
import { fetchClassStudentCount } from '@/service/teacher/echarts/basic';
import styles from '../index.less';

const ClassDistribution: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts>();

    const { data, loading, refresh } = useRequest(fetchClassStudentCount);

    useEffect(() => {
        if (!chartRef.current) return;
        chartInstance.current = echarts.init(chartRef.current);

        return () => chartInstance.current?.dispose();
    }, []);

    useEffect(() => {
        if (data?.data && chartInstance.current) {
            chartInstance.current.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [{
                    name: '班级人数',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: data?.data || []
                }]
            });
        }
    }, [data]);

    useEffect(() => {
        const handleResize = () => chartInstance.current?.resize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleRefresh = () => {
            refresh();
        };

        window.addEventListener('refreshClassDistribution', handleRefresh);
        return () => {
            window.removeEventListener('refreshClassDistribution', handleRefresh);
        };
    }, [refresh]);

    return (
        <Card title="班级人数分布" className={styles.card}>
            <Spin spinning={loading}>
                <div ref={chartRef} className={styles.chart} />
            </Spin>
        </Card>
    );
};

export default ClassDistribution; 