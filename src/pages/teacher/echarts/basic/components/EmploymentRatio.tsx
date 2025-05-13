import React, { useEffect, useRef } from "react"
import * as echarts from "echarts"
import { Card, Spin } from "antd"
import { useRequest } from "ahooks"
import { fetchEmploymentAndEnrollmentRatio } from "@/service/teacher/echarts/basic"
import styles from "../index.less"

// 就业升学比例组件
const EmploymentRatio: React.FC = () => {
  // 图表容器的ref
  const chartRef = useRef<HTMLDivElement>(null)
  // echarts实例的ref
  const chartInstance = useRef<echarts.ECharts>()

  // 获取就业升学比例数据
  const { data, loading, refresh } = useRequest(
    fetchEmploymentAndEnrollmentRatio
  )

  // 初始化echarts实例
  useEffect(() => {
    if (!chartRef.current) return
    chartInstance.current = echarts.init(chartRef.current)

    // 组件卸载时销毁echarts实例
    return () => chartInstance.current?.dispose()
  }, [])

  // 当数据更新时重新渲染图表
  useEffect(() => {
    if (data?.data && chartInstance.current) {
      // 定义渐变色数组
      const colors = [
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#ff7c7c" },
          { offset: 1, color: "#ff3636" },
        ]),
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#73d13d" },
          { offset: 1, color: "#52c41a" },
        ]),
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#ffd666" },
          { offset: 1, color: "#faad14" },
        ]),
      ]

      // 设置图表配置项
      chartInstance.current.setOption({
        tooltip: {
          trigger: "item",
          formatter: (params: any) => {
            return `${params.name}<br/>人数：${params.value} (${params.percent}%)`
          },
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderColor: "#f0f0f0",
          borderWidth: 1,
          textStyle: {
            color: "#666",
          },
          extraCssText: "box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);",
        },
        legend: {
          top: "5%",
          left: "center",
          textStyle: {
            color: "#666",
          },
          itemWidth: 15,
          itemHeight: 15,
          itemGap: 20,
          icon: "circle",
        },
        series: [
          {
            name: "就业升学比例",
            type: "pie",
            radius: ["30%", "75%"],
            center: ["50%", "55%"],
            roseType: "radius",
            itemStyle: {
              borderRadius: 8,
              borderColor: "#fff",
              borderWidth: 2,
              shadowBlur: 20,
              shadowColor: "rgba(0, 0, 0, 0.1)",
            },
            label: {
              show: true,
              position: "outside",
              formatter: "{b}\n{c}人",
              color: "#666",
              fontSize: 12,
              fontWeight: 500,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: 4,
              padding: [4, 8],
              alignTo: "edge",
              edgeDistance: "10%",
            },
            labelLine: {
              length: 15,
              length2: 0,
              maxSurfaceAngle: 80,
            },
            data: data?.data?.map((item: any, index: number) => ({
              /* 把data中的name和value赋值给item */
              ...item,
              itemStyle: {
                color: colors[index % colors.length],
              },
            })),
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx: number) {
              return Math.random() * 200
            },
          },
        ],
      })
    }
  }, [data])

  // 监听窗口大小变化,重新调整图表大小
  useEffect(() => {
    const handleResize = () => chartInstance.current?.resize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  useEffect(() => {
    const handleRefresh = () => {
      refresh()
    }

    window.addEventListener("refreshEmploymentRatio", handleRefresh)
    return () => {
      window.removeEventListener("refreshEmploymentRatio", handleRefresh)
    }
  }, [refresh])

  // 渲染组件
  return (
    <Card
      title="就业升学比例"
      className={styles.card}
      extra={
        <span style={{ color: "#666", fontSize: "12px" }}>南丁格尔玫瑰图</span>
      }
    >
      <Spin spinning={loading}>
        <div ref={chartRef} className={styles.chart} />
      </Spin>
    </Card>
  )
}

export default EmploymentRatio
