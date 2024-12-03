import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      component: "student/login",
      layout: false
    },
    {
      path: "/student/register",
      component: "student/register",
      layout: false
    },
    {
      path: "/teacher/login",
      component: "teacher/login",
      layout: false
    },
    {
      path: "/teacher/echarts/bigscreen",
      component: "teacher/echarts/bigscreen",
      layout: false,
      name: "大屏展示"
    },
    {
      path: "/student",
      component: "@/layouts/StudentLayout",
      layout: false,
      routes: [
        {
          path: "/student/home",
          component: "student/home",
          exact: true,
          name: "首页"
        },
        {
          path: "/student/settings",
          component: "student/settings",
          exact: true,
          name: "个人设置"
        },
        {
          path: "/student/classes",
          component: "student/classes",
          exact: true,
          name: "班级管理"
        },
        {
          path: "/student/notice",
          component: "student/notice",
          exact: true,
          name: "通知公告"
        },
        {
          path: "/student/chat",
          component: "student/chat",
          exact: true,
          name: "AI聊天"
        },
        {
          path: "/student/survey",
          component: "student/survey",
          exact: true,
          name: "问卷调查"
        }
      ]
    },
    {
      path: "/teacher",
      component: "@/layouts/TeacherLayout",
      layout: false,
      routes: [
        {
          path: "/teacher/home",
          component: "teacher/home",
          name: "首页"
        },
        {
          path: "/teacher/settings",
          component: "teacher/settings",
          name: "个人设置"
        },
        {
          path: "/teacher/manager/students",
          component: "teacher/manager/students",
          name: "学生管理"
        },
        {
          path: "/teacher/manager/notices",
          component: "teacher/manager/notices",
          name: "通知管理"
        },
        {
          path: "/teacher/manager/classes",
          component: "teacher/manager/classes",
          name: "班级管理"
        },
        {
          path: "/teacher/echarts/basic",
          component: "teacher/echarts/basic",
          name: "基础图表"
        },
      ]
    }
  ],
  npmClient: 'yarn',
  alias: {
    '@': '/src'
  },
  plugins: [
    '@umijs/plugins/dist/antd',
    '@umijs/plugins/dist/initial-state',
    '@umijs/plugins/dist/model'
  ],
  antd: {
    import: false
  },
  mfsu: false
});