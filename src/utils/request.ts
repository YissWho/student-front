import axios from 'axios'
import { message } from 'antd'  // 假设使用 ant-design-vue 作为 UI 框架
import { getToken } from './utils'
import { history } from 'umi';

// 创建 axios 实例
const request = axios.create({
    baseURL: 'https://iqekshkmfkwa.sealoshzh.site/api',  // API 基础路径
    timeout: 500000  // 请求超时时间
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 从 localStorage 获取 token
        const token = getToken()
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    error => {
        console.error('Request error:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        const res = response.data

        // 401: 未登录或token过期
        if (res.code === 401) {
            // 清除用户信息并跳转到登录页
            localStorage.removeItem('token')
            sessionStorage.removeItem('token')
            localStorage.removeItem('user')
            sessionStorage.removeItem('user')
            history.replace('/login')
            return Promise.reject(new Error(res.message || '未登录或登录已过期'))
        }

        // 直接返回响应数据，让业务代码处理具体的成功/失败逻辑
        return res
    },
    error => {
        console.error('Response error:', error)
        // 处理网络错误等
        const { response } = error
        if (response && response.data) {
            return Promise.reject(response.data)
        } else {
            message.error('网络错误，请稍后重试')
            return Promise.reject(new Error('网络错误，请稍后重试'))
        }
    }
)

export default request