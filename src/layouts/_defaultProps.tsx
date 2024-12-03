import {
  HomeOutlined,
  SettingOutlined,
  NotificationOutlined,
  TeamOutlined,
  MessageOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const studentProps = {
  route: {
    path: '/student',
    routes: [
      {
        path: '/student/home',
        name: '首页',
        icon: <HomeOutlined />,
      },
      {
        path: '/student/settings',
        name: '个人设置',
        icon: <SettingOutlined />,
      },
      {
        path: '/student/classes',
        name: '查看同学',
        icon: <TeamOutlined />,
      },
      {
        path: '/student/notice',
        name: '通知公告',
        icon: <NotificationOutlined />,
      },
      {
        path: '/student/chat',
        name: 'AI聊天',
        icon: <MessageOutlined />,
      },
      {
        path: '/student/survey',
        name: '问卷调查',
        icon: <FileTextOutlined />,
      },
    ],
  },
};

export default studentProps;