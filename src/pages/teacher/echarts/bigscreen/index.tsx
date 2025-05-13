import React, { useEffect, useState, useRef } from "react"
import { history } from "umi"
import { Button } from "antd"
import { RollbackOutlined } from "@ant-design/icons"
import {
  FullScreenContainer,
  BorderBox13,
  BorderBox8,
  Decoration5,
  Decoration8,
  /* @ts-ignore */
} from "@jiaminghi/data-view-react"
import { useRequest } from "ahooks"
import * as echarts from "echarts"
import chinaJson from "../china/data/china.json"
import {
  fetchClassStudentCount,
  fetchEmploymentAndEnrollment,
  fetchEmploymentAndEnrollmentRatio,
  fetchProvinceWordCloud,
} from "@/service/teacher/echarts/basic"
import { fetchChinaMapData } from "@/service/teacher/echarts/china"
import styles from "./index.less"

const BigScreen: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("")
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<echarts.ECharts>()
  const leftChartRef = useRef<HTMLDivElement>(null)
  const leftChartInstance = useRef<echarts.ECharts>()
  const rightChartRef = useRef<HTMLDivElement>(null)
  const rightChartInstance = useRef<echarts.ECharts>()

  // 获取各类数据
  const { data: mapData } = useRequest(fetchChinaMapData)
  const { data: classData } = useRequest(fetchClassStudentCount)
  const { data: employmentData } = useRequest(fetchEmploymentAndEnrollment)
  const { data: ratioData } = useRequest(fetchEmploymentAndEnrollmentRatio)
  const { data: provinceData } = useRequest(fetchProvinceWordCloud)

  // 添加调试输出
  useEffect(() => {
    console.log("MapData:", mapData)
    console.log("ClassData:", classData)
    console.log("EmploymentData:", employmentData)
    console.log("RatioData:", ratioData)
    console.log("ProvinceData:", provinceData)
  }, [mapData, classData, employmentData, ratioData, provinceData])

  // 更新时间
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      setCurrentTime(timeString)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // 初始化左侧图表
  useEffect(() => {
    if (!leftChartRef.current) {
      console.log("左侧图表容器不存在")
      return
    }

    console.log("初始化左侧图表")
    leftChartInstance.current = echarts.init(leftChartRef.current)
    console.log("左侧图表实例:", leftChartInstance.current)

    const handleResize = () => {
      leftChartInstance.current?.resize()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      leftChartInstance.current?.dispose()
    }
  }, [])

  // 更新左侧图表数据
  useEffect(() => {
    if (!leftChartInstance.current) {
      console.log("左侧图表实例不存在")
      return
    }

    if (!classData?.data || classData.data.length === 0) {
      console.log("左侧图表数据不存在")
      return
    }

    console.log("更新左侧图表数据:", classData)

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        top: "10%",
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: classData.data.map((item) => item.name),
        axisLabel: {
          color: "#00f6ff",
        },
        axisLine: {
          lineStyle: {
            color: "#00f6ff",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#00f6ff",
        },
        axisLine: {
          lineStyle: {
            color: "#00f6ff",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(0, 246, 255, 0.1)",
          },
        },
      },
      series: [
        {
          data: classData.data.map((item) => item.value),
          type: "bar",
          barWidth: "40%",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#00f6ff" },
              { offset: 1, color: "#0072ff" },
            ]),
          },
        },
      ],
    }

    leftChartInstance.current.setOption(option)
  }, [classData])

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current) {
      console.log("地图容器不存在")
      return
    }

    console.log("初始化地图")
    echarts.registerMap("china", chinaJson as any)
    mapInstance.current = echarts.init(mapRef.current)
    console.log("地图实例:", mapInstance.current)

    const handleResize = () => {
      mapInstance.current?.resize()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      mapInstance.current?.dispose()
    }
  }, [])

  // 更新地图数据
  useEffect(() => {
    if (!mapInstance.current) {
      console.log("地图实例不存在")
      return
    }

    if (!mapData?.data || mapData.data.length === 0) {
      console.log("地图数据不存在")
      return
    }

    console.log("更新地图数据:", mapData)

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: (params: any) =>
          `${params.name}: ${isNaN(params.value) ? 0 : params.value}人`,
      },
      visualMap: {
        type: "continuous",
        min: 0,
        max: Math.max(...mapData.data.map((item) => item.value || 0)),
        left: "left",
        bottom: "20%",
        text: ["高", "低"],
        inRange: {
          color: [
            "#001529",
            "#003666",
            "#0077b6",
            "#0096c7",
            "#00b4d8",
            "#48cae4",
            "#90e0ef",
          ],
        },
        textStyle: {
          color: "#fff",
        },
      },
      geo: {
        map: "china",
        roam: true,
        scaleLimit: {
          min: 1,
          max: 2,
        },
        zoom: 1.2,
        itemStyle: {
          normal: {
            areaColor: "rgba(0, 246, 255, 0.1)",
            borderColor: "#00f6ff",
            borderWidth: 1,
          },
          emphasis: {
            areaColor: "rgba(0, 246, 255, 0.3)",
          },
        },
        label: {
          show: false,
        },
      },
      series: [
        {
          type: "map",
          map: "china",
          geoIndex: 0,
          data: mapData.data.map((item) => ({
            name: item.name,
            value: item.value || 0,
          })),
        },
      ],
    }

    mapInstance.current.setOption(option)
  }, [mapData])

  // 初始化右侧图表
  useEffect(() => {
    if (!rightChartRef.current) {
      console.log("右侧图表容器不存在")
      return
    }

    console.log("初始化右侧图表")
    rightChartInstance.current = echarts.init(rightChartRef.current)
    console.log("右侧图表实例:", rightChartInstance.current)

    const handleResize = () => {
      rightChartInstance.current?.resize()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      rightChartInstance.current?.dispose()
    }
  }, [])

  // 更新右侧图表数据
  useEffect(() => {
    if (!rightChartInstance.current) {
      console.log("右侧图表实例不存在")
      return
    }

    if (!provinceData?.data || provinceData.data.length === 0) {
      console.log("右侧图表数据不存在")
      return
    }

    console.log("更新右侧图表数据:", provinceData)

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        top: "10%",
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        axisLabel: {
          color: "#00f6ff",
        },
        axisLine: {
          lineStyle: {
            color: "#00f6ff",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(0, 246, 255, 0.1)",
          },
        },
      },
      yAxis: {
        type: "category",
        data: provinceData.data.map((item) => item.name).slice(0, 10),
        axisLabel: {
          color: "#00f6ff",
        },
        axisLine: {
          lineStyle: {
            color: "#00f6ff",
          },
        },
      },
      series: [
        {
          type: "bar",
          data: provinceData.data.map((item) => item.value).slice(0, 10),
          barWidth: "40%",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: "#00f6ff" },
              { offset: 1, color: "#0072ff" },
            ]),
          },
        },
      ],
    }

    rightChartInstance.current.setOption(option)
  }, [provinceData])

  // 返回上一页
  const handleBack = () => {
    history.push("/teacher/echarts/basic")
  }

  return (
    <FullScreenContainer className={styles.bigscreen}>
      <BorderBox13 className={styles.header}>
        <div className={styles.title}>
          <Decoration8 />
          <span>学生就业数据分析大屏</span>
          <Decoration8 />
        </div>
        <div className={styles.time}>
          <Decoration5 />
          {currentTime}
        </div>
      </BorderBox13>

      <div className={styles.content}>
        <BorderBox8 className={styles["left-panel"]}>
          <div className={styles["panel-title"]}>班级分布</div>
          <div ref={leftChartRef} className={styles.chart} />
        </BorderBox8>

        <BorderBox8 className={styles["center-panel"]}>
          <div className={styles["panel-title"]}>全国分布</div>
          <div ref={mapRef} className={styles.map} />
        </BorderBox8>

        <BorderBox8 className={styles["right-panel"]}>
          <div className={styles["panel-title"]}>省份排名</div>
          <div ref={rightChartRef} className={styles.chart} />
        </BorderBox8>
      </div>

      <div className={styles["back-btn"]}>
        <Button type="primary" icon={<RollbackOutlined />} onClick={handleBack}>
          返回
        </Button>
      </div>
    </FullScreenContainer>
  )
}

export default BigScreen
