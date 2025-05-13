import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: "student/login",
      layout: false,
      name: "学生登录"
    },
    {
      path: "/student/register",
      component: "student/register",
      layout: false,
      name: "学生注册"
    },
    {
      path: "/teacher/login",
      component: "teacher/login",
      layout: false,
      name: "教师登录"
    },
    {
      path: "/teacher/echarts/bigscreen",
      component: "teacher/echarts/bigscreen",
      layout: false,
      name: "大屏展示"
    },
    {
      path: '/404',
      component: 'common/404',
      layout: false
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
        },
        {
          path: "/student/404",
          component: "common/404",
        },
        {
          path: "/student/500",
          component: "common/error",
        },
        {
          path: "/student/403",
          component: "common/permission",
        },
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
          path: "/teacher/manager/surveys",
          component: "teacher/manager/surveys",
          name: "问卷管理"
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
        {
          path: "/teacher/404",
          component: "common/404",
        },
        {
          path: "/teacher/500",
          component: "common/error",
        },
        {
          path: "/teacher/403",
          component: "common/permission",
        },
      ]
    },
    {
      path: "*",
      redirect: "/404"
    }
  ],
  npmClient: 'yarn',
  esbuildMinifyIIFE: true,
  alias: {
    '@': '/src',
    '@assets': '/src/assets'
  },
  plugins: [
    '@umijs/plugins/dist/antd',
    '@umijs/plugins/dist/initial-state',
    '@umijs/plugins/dist/model'
  ],
  antd: {
    import: false
  },
  mfsu: false,
  links: [{ rel: 'icon', href: '/favicon.ico' }],
  title: "应届生去向管理系统",
  publicPath: '/',
});