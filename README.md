# 基于Django的应届生去向管理系统

## 项目简介
本系统是一个基于Django REST framework和React的应届生去向管理系统，旨在帮助高校更好地管理和跟踪应届生的就业和升学情况。系统采用前后端分离架构，后端使用Django REST framework提供API接口，前端使用React构建用户界面.此为前端项目，后端项目请访问[这里]

## 技术栈
### 后端
- Django 4.0+
- Django REST framework
- JWT认证
- Redis缓存
- SQLite数据库
- 百度文心一言API

### 前端
- Web端：React 18+
- 小程序端：uni-app（开发中）
- Ant Design Pro
- ECharts

## 核心功能

### 1. 用户认证与安全
- [x] 验证码登录系统
- [x] JWT Token认证
- [x] Redis验证码缓存
- [x] 密码加密存储
- [x] 用户角色权限控制

### 2. 用户管理
- [x] 教师/学生多角色登录
- [x] 个人信息管理
- [x] 头像上传
- [x] 密码修改
- [x] 手机号绑定

### 3. 班级管理
- [x] 班级CRUD操作
- [x] 班级学生管理
- [x] 班级数据统计

### 4. 问卷调查系统
- [x] 多问卷并行支持
- [x] 问卷状态管理
- [x] 答题数据分析
- [x] 问卷结果统计

### 5. 通知公告
- [x] 通知发布管理
- [x] 阅读状态追踪
- [x] 通知分类管理
- [x] 通知查看统计

### 6. AI智能咨询
- [x] 文心一言API集成
- [x] 智能问答服务
- [x] 就业建议生成
- [x] 升学方向分析
- [x] 职业规划辅导

### 7. 数据分析与可视化
- [x] 就业趋势分析
- [x] 地区分布统计
- [x] 升学方向分析
- [x] 数据可视化图表

## 系统特点

### 1. 架构设计
- 前后端分离架构
- RESTful API设计
- 模块化开发
- 高可扩展性

### 2. 性能优化
- Redis缓存机制
- 数据库查询优化
- 分页加载
- 懒加载策略

### 3. 用户体验
- 响应式设计
- 友好的错误提示
- 操作引导
- 数据实时更新

### 4. 安全特性
- 验证码登录
- Token认证
- 数据加密
- 防重复提交
- XSS防护

## 部署要求

### 环境要求
- Python 3.8+
- Node.js 14+
- Redis 6.0+
- SQLite 3
