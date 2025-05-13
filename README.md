# 基于React的应届生去向管理系统前端

## 项目简介
本系统是一个基于React的应届生去向管理系统前端项目，旨在帮助高校更好地管理和跟踪应届生的就业和升学情况。系统采用前后端分离架构，前端使用React构建用户界面，后端使用Django REST framework提供API接口。

## 技术栈
- React 18+
- Umi 4.x
- Ant Design 5.x 与 Ant Design Pro Components
- ECharts 5.x 数据可视化
- @jiaminghi/data-view-react 大屏可视化组件库
- Zustand 状态管理
- Axios 网络请求
- TypeScript 类型支持
- Ahooks React Hooks 库

## 项目结构
```
src/
├── assets/         # 静态资源
├── components/     # 通用组件
├── config/         # 全局配置
├── constants/      # 常量定义
├── layouts/        # 布局组件
│   ├── StudentLayout.tsx    # 学生端布局
│   └── TeacherLayout.tsx    # 教师端布局  
├── pages/          # 页面组件
│   ├── common/     # 通用页面
│   ├── student/    # 学生端页面
│   └── teacher/    # 教师端页面
│       ├── echarts/    # 数据可视化
│       │   ├── basic/     # 基础图表
│       │   ├── bigscreen/ # 大屏展示
│       │   └── china/     # 中国地图
│       ├── home/      # 首页
│       ├── login/     # 登录页
│       ├── manager/   # 管理模块
│       │   ├── classes/  # 班级管理
│       │   ├── notices/  # 通知管理
│       │   ├── students/ # 学生管理
│       │   └── surveys/  # 问卷管理
│       └── settings/  # 设置页面
├── service/        # API服务
│   ├── common/     # 通用API
│   ├── student/    # 学生端API
│   └── teacher/    # 教师端API
│       ├── echarts/   # 图表数据API
│       └── mange/     # 管理模块API
├── store/          # 状态管理
│   ├── useRoleStore.ts
│   ├── useTeacherStore.ts
│   └── useUserStore.ts
└── utils/          # 工具函数
    ├── request.ts  # 请求封装
    └── utils.ts    # 通用工具
```

## 核心功能

### 1. 用户认证与安全
- [x] 登录系统
- [x] JWT Token认证
- [x] 用户角色权限控制

### 2. 用户管理
- [x] 教师/学生多角色登录
- [x] 个人信息管理
- [x] 头像上传
- [x] 密码修改
- [x] 手机号绑定

### 3. 班级管理
- [x] 班级列表展示
- [x] 班级学生管理
- [x] 班级数据统计

### 4. 问卷调查系统
- [x] 问卷列表展示
- [x] 问卷状态管理
- [x] 问卷填写界面
- [x] 问卷数据分析

### 5. 通知公告
- [x] 通知列表展示与发布
- [x] 阅读状态追踪
- [x] 通知分类展示
- [x] 通知查看统计

### 6. 数据分析与可视化
- [x] 就业趋势分析图表
- [x] 班级分布饼图
- [x] 就业升学比例图表
- [x] 省份分布词云图
- [x] 中国地图展示省份分布
- [x] 可视化大屏展示系统

## 系统特点

### 1. 架构设计
- 前后端分离架构
- 模块化组件开发
- 基于角色的页面划分
- 响应式布局

### 2. 交互体验
- 优雅的UI设计
- 实时数据更新
- 交互动效
- 移动端适配

### 3. 数据可视化
- 多种图表类型支持
- 数据联动机制
- 自定义主题
- 大屏展示系统

### 4. 状态管理
- 基于Zustand的状态管理
- 持久化存储
- 用户信息全局管理
- 响应式数据流

## 开发与运行
```bash
# 安装依赖
yarn install

# 开发模式运行
yarn dev

# 构建生产版本
yarn build

# 清理构建文件
yarn clean
```

## 浏览器支持
- Chrome (推荐)
- Firefox
- Safari
- Edge

## 环境要求
- Node.js 14+
- Yarn 1.22+
