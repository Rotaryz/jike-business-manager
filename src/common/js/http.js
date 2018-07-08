'use strict'
import axios from 'axios'
import {BASE_URL} from 'api/config'
// import VueRouter from 'vue-router'
import _this from '../../main'

// const router = new VueRouter()

const TIME_OUT = 10000
const COMMON_HEADER = {}
const ERR_OK = 0
const ERR_NO = -404

axios.interceptors.request.use(config => {
  // 请求数据前的拦截
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

function checkStatus(response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 422)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: ERR_NO,
    msg: '网络异常'
  }
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === ERR_NO) {
    console.warn(res.msg)
  }
  // 如果网络请求成功，而提交的数据，或者是后端的一些未知错误所导致的，可以根据实际情况进行捕获异常
  if (res.data && (res.data.code !== ERR_OK)) {
    switch (res.data.code) {
      case TIME_OUT:
        localStorage.removeItem('business-token')
        _this.$router.push('/login')
        break
    }
    // 可以进行switch操作，根据返回的code进行相对应的操作，然后抛异常
    console.warn(res.data.message)
    throw requestException(res)
  }
  return res.data
}

function requestException(res) {
  const error = {}
  error.statusCode = res.status
  const serviceData = res.data
  if (serviceData) {
    error.code = serviceData.code
    error.error = serviceData.error
    error.message = serviceData.message
    error.serverData = serviceData
  }
  return error
}

export default {
  setDefaults() {
    let authorization = localStorage.getItem('business-token') || sessionStorage.getItem('business-token')
    axios.defaults.headers.common['Authorization'] = authorization
    axios.defaults.baseURL = BASE_URL.api
  },
  post(url, data) {
    this.setDefaults()
    return axios({
      method: 'post',
      url,
      data,
      timeout: TIME_OUT,
      headers: COMMON_HEADER
    }).then((response) => {
      return checkStatus(response)
    }).then((res) => {
      return checkCode(res)
    })
  },
  get(url, params) {
    this.setDefaults()
    return axios({
      method: 'get',
      url,
      params, // get 请求时带的参数
      timeout: TIME_OUT,
      headers: COMMON_HEADER
    }).then((response) => {
      return checkStatus(response)
    }).then((res) => {
      return checkCode(res)
    })
  },
  put(url, data) {
    this.setDefaults()
    return axios({
      method: 'put',
      url,
      data, // put 请求时带的参数
      timeout: TIME_OUT,
      headers: COMMON_HEADER
    }).then((response) => {
      return checkStatus(response)
    }).then((res) => {
      return checkCode(res)
    })
  },
  delete(url, data) {
    this.setDefaults()
    return axios({
      method: 'delete',
      url,
      data, // put 请求时带的参数
      timeout: TIME_OUT,
      headers: COMMON_HEADER
    }).then((response) => {
      return checkStatus(response)
    }).then((res) => {
      return checkCode(res)
    })
  }
}
