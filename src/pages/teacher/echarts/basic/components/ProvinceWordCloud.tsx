import React, { useEffect, useRef } from "react"
import * as echarts from "echarts"
import "echarts-wordcloud"
import { Card, Spin } from "antd"
import { useRequest } from "ahooks"
import { fetchProvinceWordCloud } from "@/service/teacher/echarts/basic"
import styles from "../index.less"

const ProvinceWordCloud: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts>()

  const { data, loading, refresh } = useRequest(fetchProvinceWordCloud)

  useEffect(() => {
    if (!chartRef.current) return
    chartInstance.current = echarts.init(chartRef.current)

    return () => chartInstance.current?.dispose()
  }, [])

  useEffect(() => {
    if (data?.data && chartInstance.current) {
      chartInstance.current.setOption({
        tooltip: {
          show: true,
          formatter: "{b}: {c}人",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderColor: "#f0f0f0",
          borderWidth: 1,
          padding: [8, 12],
          textStyle: {
            color: "#666",
            fontSize: 13,
          },
        },
        series: [
          {
            type: "wordCloud",
            shape: "circle",
            width: "100%",
            height: "100%",
            sizeRange: [14, 50],
            rotationRange: [-45, 45],
            rotationStep: 15,
            gridSize: 8,
            drawOutOfBound: false,
            textStyle: {
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
              fontWeight: "bold",
              color: function () {
                const colors = [
                  "#1890FF",
                  "#52C41A",
                  "#FF4D4F",
                  "#FAAD14",
                  "#13C2C2",
                  "#722ED1",
                  "#EB2F96",
                  "#52C41A",
                ]
                return colors[Math.floor(Math.random() * colors.length)]
              },
            },
            emphasis: {
              textStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.15)",
              },
            },
            data: data.data,
          },
        ],
      })
    }
  }, [data])

  useEffect(() => {
    const handleResize = () => chartInstance.current?.resize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleRefresh = () => {
      refresh()
    }

    window.addEventListener("refreshProvinceCloud", handleRefresh)
    return () => {
      window.removeEventListener("refreshProvinceCloud", handleRefresh)
    }
  }, [refresh])

  return (
    <Card
      title="意向省份分布"
      className={styles.card}
      extra={
        <span
          style={{
            color: "#666",
            fontSize: "12px",
            background: "rgba(24, 144, 255, 0.1)",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          动态词云图
        </span>
      }
    >
      <Spin spinning={loading}>
        <div
          ref={chartRef}
          className={styles.chart}
          style={{ height: "400px" }}
        />
      </Spin>
    </Card>
  )
}

export default ProvinceWordCloud
