import React, { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import { Card, Button, message } from "antd"
import { RollbackOutlined } from "@ant-design/icons"
import chinaJson from "./data/china.json"
import styles from "./index.less"

// 省份名称与行政区划代码映射
const provinceMap: { [key: string]: string } = {
  北京市: "110000",
  天津市: "120000",
  河北省: "130000",
  山西省: "140000",
  内蒙古自治区: "150000",
  辽宁省: "210000",
  吉林省: "220000",
  黑龙江省: "230000",
  上海市: "310000",
  江苏省: "320000",
  浙江省: "330000",
  安徽省: "340000",
  福建省: "350000",
  江西省: "360000",
  山东省: "370000",
  河南省: "410000",
  湖北省: "420000",
  湖南省: "430000",
  广东省: "440000",
  广西壮族自治区: "450000",
  海南省: "460000",
  重庆市: "500000",
  四川省: "510000",
  贵州省: "520000",
  云南省: "530000",
  西藏自治区: "540000",
  陕西省: "610000",
  甘肃省: "620000",
  青海省: "630000",
  宁夏回族自治区: "640000",
  新疆维吾尔自治区: "650000",
  台湾省: "710000",
  香港特别行政区: "810000",
  澳门特别行政区: "820000",
}

const ChinaEcharts: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts>()
  const [currentMap, setCurrentMap] = useState<string>("china")
  const [mapStack, setMapStack] = useState<string[]>(["china"])

  // 加载省份地图数据
  const loadProvinceMap = async (provinceName: string) => {
    try {
      // 获取省份代码
      const provinceCode = provinceMap[provinceName]
      if (!provinceCode) {
        console.log("未找到省份代码:", provinceName) // 调试用
        message.error("暂不支持该地区地图")
        return null
      }

      const response = await fetch(
        `https://geo.datav.aliyun.com/areas_v3/bound/${provinceCode}_full.json`
      )
      if (!response.ok) {
        throw new Error("地图数据加载失败")
      }
      const json = await response.json()

      // 注册地图时使用省份代码作为名称
      echarts.registerMap(provinceCode, json)
      return json
    } catch (error) {
      console.error("加载省份地图数据失败:", error)
      message.error("地图数据加载失败，请稍后重试")
      return null
    }
  }

  // 处理地图点击事件
  const handleMapClick = async (params: any) => {
    console.log("点击的地区:", params.name) // 调试用

    // 如果点击的是省份名称
    if (params.name && currentMap === "china") {
      // 检查是否支持该省份
      if (!provinceMap[params.name]) {
        console.log("不支持的地区:", params.name) // 调试用
        message.info("暂不支持该地区地图")
        return
      }

      // 加载省份地图
      const provinceData = await loadProvinceMap(params.name)
      if (provinceData) {
        const provinceCode = provinceMap[params.name]
        setCurrentMap(provinceCode)
        setMapStack((prev) => [...prev, provinceCode])
        updateMap(provinceCode, params.name)
      }
    } else if (currentMap !== "china") {
      // 如果在省级地图中点击，返回全国地图
      setCurrentMap("china")
      setMapStack(["china"])
      updateMap("china", "全国")
    }
  }

  // 更新地图
  const updateMap = (mapName: string, displayName: string) => {
    if (!chartInstance.current) return

    const option = {
      backgroundColor: "#fff",
      title: {
        text: mapName === "china" ? "全国就业分布" : `${displayName}就业分布`,
        left: "center",
        top: 20,
        textStyle: {
          color: "#333",
          fontSize: 24,
          fontWeight: "normal",
        },
      },
      tooltip: {
        trigger: "item",
        enterable: true,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "#f0f0f0",
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          color: "#666",
        },
        formatter: (params: any) => {
          return `${params.name}<br/>就业人数：${params.value || 0}人`
        },
      },
      visualMap: {
        type: "continuous",
        min: 0,
        max: 100,
        left: 30,
        bottom: 30,
        text: ["高", "低"],
        inRange: {
          color: ["#e6f7ff", "#1890ff", "#0050b3"],
        },
        textStyle: {
          color: "#666",
        },
        calculable: true,
        dimension: 0,
      },
      geo: {
        map: mapName,
        roam: true,
        scaleLimit: {
          min: 1,
          max: 2,
        },
        zoom: 1.2,
        label: {
          show: true,
          fontSize: 10,
          color: "#333",
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1,
          areaColor: "#e6f7ff",
        },
        emphasis: {
          label: {
            show: true,
            color: "#333",
          },
          itemStyle: {
            areaColor: "#1890ff",
          },
        },
      },
      series: [
        {
          type: "map",
          map: mapName,
          geoIndex: 0,
          data: [],
        },
      ],
    }

    chartInstance.current.setOption(option, true)
  }

  // 返回上一级地图
  const handleBack = () => {
    if (mapStack.length > 1) {
      const newStack = mapStack.slice(0, -1)
      const previousMap = newStack[newStack.length - 1]
      setCurrentMap(previousMap)
      setMapStack(newStack)
      updateMap(previousMap, "全国")
    }
  }

  useEffect(() => {
    if (!chartRef.current) return

    // 注册中国地图
    echarts.registerMap("china", chinaJson as any)

    // 初始化图表
    chartInstance.current = echarts.init(chartRef.current, undefined, {
      renderer: "canvas",
      useDirtyRect: true,
    })

    // 绑定点击事件
    chartInstance.current.on("click", handleMapClick)

    // 初始化全国地图
    updateMap("china", "全国")

    return () => {
      chartInstance.current?.off("click")
      chartInstance.current?.dispose()
    }
  }, [])

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize({
          animation: {
            duration: 300,
          },
        })
      }
    }

    const throttledResize = (() => {
      let timer: NodeJS.Timeout | null = null
      return () => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(handleResize, 100)
      }
    })()

    window.addEventListener("resize", throttledResize)
    return () => window.removeEventListener("resize", throttledResize)
  }, [])

  return (
    <Card
      className={styles.card}
      extra={
        currentMap !== "china" && (
          <Button
            type="primary"
            icon={<RollbackOutlined />}
            onClick={handleBack}
          >
            返回上级
          </Button>
        )
      }
    >
      <div ref={chartRef} style={{ height: "800px", width: "100%" }} />
    </Card>
  )
}

export default ChinaEcharts
