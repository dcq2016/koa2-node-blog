import axios from 'axios';
import Qs from 'qs';
import {
  getStorage
} from './util';
import Vue from 'vue';
import router from '@/router';

const instance = axios.create({
  // baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api/v1':'',
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 30000, // 指定请求超时的毫秒数(0 表示无超时时间)
  withCredentials: false // 默认 表示跨域请求时是否需要使用凭证
});

instance.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest'
};

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (config.method === 'post') {
    //isQs
    if (!config.headers.isQs) {
      config.data = Qs.stringify(config.data);
    }
  }
  // 获取token
  config.headers.common['Authorization'] = 'Bearer ' + getStorage("Authorization");
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  if (error && error.response) {
    if (error.response.status) {
      switch (error.response.status) {
        case 401:
          Vue.prototype.$Message.error(error.response.data.message);
          localStorage.clear();
          router.push({
            name: 'Login'
          })
          break;
        case 404:
          Vue.prototype.$Message.error('网络请求不存在');
          localStorage.clear();
          router.push({
            name: 'Signup'
          })
          break;
      }
    }
  }
  return Promise.reject(error);
});

export default {
  get(url, params = {}, headers = {}) {
    return instance.get(url, {
      params,
      headers
    })
  },
  post(url, params = null, headers = {}, CANCELTOKEN = null) {
    return instance.post(url, params, {
      headers,
      cancelToken: CANCELTOKEN
    })
  },
  file(url, param = null, headers = {}) {
    return instance.post(url, param, {
      headers: Object.assign(headers, {
        'Content-Type': 'multipart/form-data',
        isQs: true
      })
    })
  },
}