import axios from 'axios'
import { message } from 'antd'
import { getToken } from './utils'
import { history } from 'umi';
import { BASE_URL, CONFIG } from '@/config'

const request = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: CONFIG.TIMEOUT
})

request.interceptors.request.use(
    config => {
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

request.interceptors.response.use(
    response => {
        const res = response.data

        if (res.code === 401) {
            localStorage.removeItem('token')
            sessionStorage.removeItem('token')
            localStorage.removeItem('user')
            sessionStorage.removeItem('user')
            history.replace('/login')
            return Promise.reject(new Error(res.message || '未登录或登录已过期'))
        }

        return res
    },
    error => {
        console.error('Response error:', error)
        const { response } = error
        /* 判断是否是token过期 */
        if (response && response.data && response.data.code === 401 && response.statusText === 'Unauthorized') {
            localStorage.removeItem('token')
            sessionStorage.removeItem('token')
            localStorage.removeItem('user')
            sessionStorage.removeItem('user')
            history.replace('/login')
            return Promise.reject(new Error(response.data.message || '登录已过期'))
        }
        if (response && response.data) {
            return Promise.reject(response.data)
        } else {
            message.error('网络错误，请稍后重试')
            return Promise.reject(new Error('网络错误，请稍后重试'))
        }
    }
)

export default request