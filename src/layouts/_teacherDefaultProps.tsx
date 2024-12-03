import {
    HomeOutlined,
    SettingOutlined,
    BarChartOutlined,
    TeamOutlined,
    NotificationOutlined,
    UserOutlined,
    GlobalOutlined,
    SaveOutlined
} from '@ant-design/icons';

const teacherProps = {
    route: {
        path: '/teacher',
        routes: [
            {
                path: '/teacher/home',
                name: '首页',
                icon: <HomeOutlined />,
            },
            {
                path: '/teacher/settings',
                name: '个人设置',
                icon: <SettingOutlined />,
            },
            {
                path: '/teacher/manager',
                name: '信息管理',
                icon: <TeamOutlined />,
                routes: [
                    {
                        path: '/teacher/manager/students',
                        name: '学生管理',
                        icon: <UserOutlined />,
                    },
                    {
                        path: '/teacher/manager/classes',
                        name: '班级管理',
                        icon: <TeamOutlined />,
                    },
                    {
                        path: '/teacher/manager/notices',
                        name: '通知管理',
                        icon: <NotificationOutlined />,
                    },
                    {
                        path: '/teacher/manager/surveys',
                        name: '问卷管理',
                        icon: <SaveOutlined />,
                    },
                ],
            },
            {
                path: '/teacher/echarts',
                name: '数据可视化',
                icon: <BarChartOutlined />,
                routes: [
                    {
                        path: '/teacher/echarts/basic',
                        name: '基础图表',
                        icon: <BarChartOutlined />,
                    },
                    {
                        path: '/teacher/echarts/bigscreen',
                        name: '大屏展示',
                        icon: <GlobalOutlined />,
                    },
                ],
            },
        ],
    },
};

export default teacherProps; 