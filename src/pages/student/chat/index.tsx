import {
    Bubble,
    Conversations,
    Prompts,
    Sender,
    Welcome,
    useXAgent,
    useXChat
} from '@ant-design/x';
import { createStyles } from 'antd-style';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { getChatHistory } from '@/service/student/chat';
import { useUserStore } from '@/store/useUserStore';
import {
    CommentOutlined,
    EllipsisOutlined,
    FireOutlined,
    HeartOutlined,
    ReadOutlined,
    ShareAltOutlined,
    SmileOutlined,
    UserOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, type GetProp, Space, Spin } from 'antd';
import { BASE_URL } from '@/config';

// 动画变体配置
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5
        }
    }
};

const menuVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const chatVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const renderTitle = (icon: React.ReactElement, title: string) => (
    <Space align="start">
        {icon}
        <span>{title}</span>
    </Space>
);

const useStyle = createStyles(({ token, css }) => {
    return {
        layout: css`
            width: 100%;
            height: 100vh;
            border-radius: 8px;
            display: flex;
            background: ${token.colorBgContainer};
            font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
            .ant-prompts {
                color: ${token.colorText};
            }
            overflow: hidden;
        `,
        menu: css`
            background: ${token.colorBgLayout}80;
            width: 280px;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        `,
        conversations: css`
            padding: 0 12px;
            overflow-y: auto;
        `,
        chat: css`
            height: 100%;
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            padding: 24px 0;
            gap: 16px;
            overflow: hidden;
        `,
        messages: css`
            flex: 1;
            overflow-y: auto;
            padding: 0 24px;
        `,
        placeholder: css`
            flex: 1;
            padding-top: 32px;
        `,
        sender: css`
            box-shadow: ${token.boxShadow};
        `,
        logo: css`
            display: flex;
            height: 72px;
            align-items: center;
            justify-content: start;
            padding: 0 24px;
            box-sizing: border-box;
  
            img {
                width: 24px;
                height: 24px;
                display: inline-block;
            }
  
            span {
                display: inline-block;
                margin: 0 8px;
                font-weight: bold;
                color: ${token.colorText};
                font-size: 16px;
            }
        `,
        addBtn: css`
            background: #1677ff0f;
            border: 1px solid #1677ff34;
            width: calc(100% - 24px);
            margin: 0 12px 24px 12px;
            transition: all 0.3s ease;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
        `,
    };
});

const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
        key: '1',
        label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, '热门话题'),
        description: '你最关心的问题是什么？',
        children: [
            {
                key: '1-1',
                description: '如何准备考研复试面试？',
            },
            {
                key: '1-2',
                description: '应届生求职有哪些技巧？',
            },
            {
                key: '1-3',
                description: '如何平衡考研和就业准备？',
            },
        ],
    },
    {
        key: '2',
        label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, '职业规划'),
        description: '让我们一起规划你的未来',
        children: [
            {
                key: '2-1',
                icon: <HeartOutlined />,
                description: '如何选择适合自己的城市？',
            },
            {
                key: '2-2',
                icon: <SmileOutlined />,
                description: '考研院校和专业如何选择？',
            },
            {
                key: '2-3',
                icon: <CommentOutlined />,
                description: '如何提升求职竞争力？',
            },
        ],
    },
];

const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
        key: '1',
        description: '就业指导',
        icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
    },
    {
        key: '2',
        description: '考研咨询',
        icon: <ReadOutlined style={{ color: '#1890FF' }} />,
    },
];

// 定义会话类型
interface Conversation {
    id: string;
    title: string;
    messages: Array<{
        id: string;
        message: string;
        status: string;
    }>;
}

const Chat: React.FC = () => {
    // ==================== Style ====================
    const { styles } = useStyle();
    // ==================== State ====================
    const [content, setContent] = React.useState('');
    const { basic_info } = useUserStore((state) => state.info);

    const roles: GetProp<typeof Bubble.List, 'roles'> = {
        ai: {
            placement: 'start',
            typing: { step: 5, interval: 20 },
            avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
            styles: {
                content: {
                    borderRadius: 16,
                },
            },
            loadingRender: () => (
                <Space>
                    <Spin size="small" />
                    思考中...
                </Space>
            ),
        },
        local: {
            placement: 'end',
            variant: 'shadow',
            avatar: {
                size: 40,
                src: `${BASE_URL}/${basic_info?.avatar}`,
            },
        },
    };

    // 使用 useRequest 处理聊天请求
    const { runAsync: sendMessage, loading } = useRequest(getChatHistory, {
        manual: true,
    });
    // 修改 useXAgent 配置
    const [agent] = useXAgent({
        request: async ({ message }, { onSuccess, onError }) => {
            try {
                const res: any = await sendMessage({ message });

                if (res.code === 200 && res.status === 'success') {
                    onSuccess(res.data.reply);
                } else {
                    onError(new Error('请求失败，请稍后重试'));
                }
            } catch (error) {
                onError(error as Error);
            }
        },
    });

    // 会话管理相关状态
    const [conversations, setConversations] = React.useState<Conversation[]>(() => {
        const savedConversations = sessionStorage.getItem('conversations');
        if (savedConversations) {
            return JSON.parse(savedConversations);
        }
        return [{
            id: '1',
            title: '新对话',
            messages: []
        }];
    });
    const [currentConversationId, setCurrentConversationId] = React.useState<string>(conversations[0].id);

    // 保存会话到 sessionStorage
    const saveConversations = (newConversations: Conversation[]) => {
        sessionStorage.setItem('conversations', JSON.stringify(newConversations));
        setConversations(newConversations);
    };

    // 新建会话
    const createNewConversation = () => {
        const newConversation: Conversation = {
            id: Date.now().toString(),
            title: `新对话 ${conversations.length + 1}`,
            messages: []
        };
        const newConversations = [...conversations, newConversation];
        saveConversations(newConversations);
        setCurrentConversationId(newConversation.id);
        setMessages([]); // 清空当前消息列表
    };

    // 切换会话
    const switchConversation = (conversationId: string) => {
        // 保存当前会话的消息
        const updatedConversations = conversations.map(conv => {
            if (conv.id === currentConversationId) {
                return { ...conv, messages };
            }
            return conv;
        });
        saveConversations(updatedConversations as Conversation[]);

        // 切换到新会话
        setCurrentConversationId(conversationId);
        const targetConversation = updatedConversations.find(c => c.id === conversationId);
        setMessages(targetConversation?.messages as any || []);
    };

    // 修改 useXChat 配置
    const { onRequest, messages, setMessages } = useXChat({
        agent,
        defaultMessages: conversations.find(c => c.id === currentConversationId)?.messages as any || [],
    });

    // 当消息更新时保存到当前会话
    useEffect(() => {
        if (messages.length > 0) {
            const updatedConversations = conversations.map(conv => {
                if (conv.id === currentConversationId) {
                    return { ...conv, messages };
                }
                return conv;
            });
            saveConversations(updatedConversations as Conversation[]);
        }
    }, [messages, currentConversationId]);

    useEffect(() => {
        return () => {
            // 这里不清除消息,让消息保持到用户注销
        };
    }, []);

    const logoNode = (
        <div className={styles.logo}>
            <img
                src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
                draggable={false}
                alt="logo"
            />
            <span>学业规划助手</span>
        </div>
    );

    const onSubmit = (nextContent: string) => {
        if (!nextContent?.trim()) return;
        onRequest(nextContent);
        setContent('');
    };

    const onChange = (nextContent: string) => {
        setContent(nextContent);
    };

    const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
        onRequest(info.data.description as string);
    };


    // ==================== Nodes ====================

    const items: GetProp<typeof Bubble.List, 'items'> = messages.map(({ id, message, status }) => ({
        key: id,
        loading: status === 'loading',
        role: status === 'local' ? 'local' : 'ai',
        content: message,
    }));

    const placeholderNode = (
        <Space direction="vertical" size={16} className={styles.placeholder}>
            <Welcome
                variant="borderless"
                icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                title="你好，我是你的学业规划助手"
                description="不论是就业还是考研，我都会尽我所能为你解答疑惑，帮助你做出最适合自己的选择"
                extra={
                    <Space>
                        <Button icon={<ShareAltOutlined />} />
                        <Button icon={<EllipsisOutlined />} />
                    </Space>
                }
            />
            <Prompts
                title="你想了解什么？"
                items={placeholderPromptsItems}
                styles={{
                    list: {
                        width: '100%',
                    },
                    item: {
                        flex: 1,
                    },
                }}
                onItemClick={onPromptsItemClick}
            />
        </Space>
    );


    // ==================== Render =================
    return (
        <ProCard>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={styles.layout}
            >
                <motion.div variants={menuVariants} className={styles.menu}>
                    <motion.div variants={itemVariants}>
                        {logoNode}
                    </motion.div>
                    {/* 会话列表 */}
                    <motion.div variants={itemVariants}>
                        <Button
                            type="link"
                            onClick={createNewConversation}
                            className={styles.addBtn}
                            icon={<PlusOutlined />}
                        >
                            新建对话
                        </Button>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Conversations
                            className={styles.conversations}
                            items={conversations.map(conv => ({
                                key: conv.id,
                                label: conv.title,
                            }))}
                            activeKey={currentConversationId}
                            onActiveChange={switchConversation}
                        />
                    </motion.div>
                </motion.div>
                <motion.div variants={chatVariants} className={styles.chat}>
                    {/* 🌟 欢迎占位 */}
                    <AnimatePresence mode="wait">
                        {!items.length ? (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {placeholderNode}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="messages"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={styles.messages}
                            >
                                {/* 🌟 消息列表 */}
                                <Bubble.List
                                    items={items.map((item, index) => ({
                                        ...item,
                                        animate: {
                                            initial: { opacity: 0, y: 20 },
                                            animate: {
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    delay: index * 0.1
                                                }
                                            }
                                        }
                                    }))}
                                    roles={roles}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* 🌟 提示词 */}
                    <motion.div variants={itemVariants} transition={{ delay: 0.3 }}>
                        <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
                    </motion.div>
                    {/* 🌟 输入框 */}
                    <motion.div variants={itemVariants} transition={{ delay: 0.4 }}>
                        <Sender
                            value={content}
                            onChange={onChange}
                            onSubmit={onSubmit}
                            loading={loading}
                            className={styles.sender}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
        </ProCard>
    );
};

export default Chat;