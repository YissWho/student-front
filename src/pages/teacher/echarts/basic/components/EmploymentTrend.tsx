import React, { useEffect, useRef } from "react"
import * as echarts from "echarts"
import { Card, Spin } from "antd"
import { useRequest } from "ahooks"
import { fetchEmploymentAndEnrollment } from "@/service/teacher/echarts/basic"
import styles from "../index.less"

const EmploymentTrend: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts>()

  const { data, loading, refresh } = useRequest(fetchEmploymentAndEnrollment)

  useEffect(() => {
    if (!chartRef.current) return
    chartInstance.current = echarts.init(chartRef.current)

    return () => chartInstance.current?.dispose()
  }, [])

  useEffect(() => {
    if (data?.data && chartInstance.current) {
      chartInstance.current.setOption({
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderColor: "#f0f0f0",
          borderWidth: 1,
          textStyle: {
            color: "#666",
          },
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["就业人数", "升学人数"],
          top: 10,
          textStyle: {
            color: "#666",
          },
        },
        grid: {
          top: "15%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          // x轴数据
          data: data?.data?.xAxis || [],
          axisLine: {
            lineStyle: {
              color: "#ddd",
            },
          },
          axisLabel: {
            color: "#666",
            fontSize: 12,
            interval: 0,
            rotate: 30,
          },
        },
        yAxis: {
          type: "value",
          // y轴分割线
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#eee",
            },
          },
          axisLabel: {
            color: "#666",
            fontSize: 12,
          },
        },
        series: [
          {
            name: "就业人数",
            type: "bar",
            barWidth: "20%",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" },
              ]),
              borderRadius: [4, 4, 0, 0],
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" },
                ]),
              },
            },
            // 就业人数数据
            data: data?.data?.series[0].data || [],
          },
          {
            name: "升学人数",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              color: "#ff7070",
              borderWidth: 2,
              borderColor: "#fff",
            },
            lineStyle: {
              width: 3,
              color: "#ff7070",
            },
            areaStyle: {
              opacity: 0.1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#ff7070" },
                { offset: 1, color: "rgba(255, 112, 112, 0.1)" },
              ]),
            },
            emphasis: {
              itemStyle: {
                borderWidth: 3,
                shadowColor: "rgba(255, 112, 112, 0.5)",
                shadowBlur: 10,
              },
            },
            // 升学人数数据
            data: data?.data?.series[1].data || [],
          },
        ],
        animationDuration: 2000,
        animationEasing: "cubicInOut",
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

    window.addEventListener("refreshEmploymentTrend", handleRefresh)
    return () => {
      window.removeEventListener("refreshEmploymentTrend", handleRefresh)
    }
  }, [refresh])
  return (
    <Card title="就业升学趋势" className={styles.card}>
      <Spin spinning={loading}>
        <div ref={chartRef} className={styles.chart} />
      </Spin>
    </Card>
  )
}

export default EmploymentTrend
