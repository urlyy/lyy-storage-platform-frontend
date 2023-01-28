//1、引入axios
import axios from 'axios'
import { userStore } from '@/store/user'
const uStore = userStore()
import config from '@/my-config.json'

//2、创建axios的实例
let httpService = axios.create({
  baseURL: config.configs[config.ENV].backend_path
})

//3、axios的拦截--request
httpService.interceptors.request.use(
  (config) => {
    // 请求成功处理
    config.headers.token = uStore.token
    return config
  },
  (err) => {
    Promise.reject(err) // 请求错误处理
  }
)

//4、axios的拦截--response
httpService.interceptors.response.use(
  (response) => {
    // console.log("拦截器拦下来了");
    if (response.data.code === 200) {
      // console.log("请求成功");
    } else {
      console.log(response.data.message)
    }
    return response
  },
  (err) => {
    // TODO:具体的code对应的处理可继续添加修改
    // if(err.response.code === 301){
    //     console.log('登录过期');
    //      //登录过期跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面 ---主页(index) 或者 退出到登录前的浏览的页面
    //     //这样登录页面登录接口成功之后可以进行跳转 主页(index) 或者 退出到登录前的页面： let path = this.$route.query.redirect || '/index.js';   this.$router.push(path);
    //     setTimeout(() => {
    //       this.$router.replace({
    //         path: '/login',
    //         query: {
    //           redirect: this.$router.currentRoute.fullPath
    //         }
    //       });
    //     }, 1000);
    //     localStorage.setItem('token','');//清除token
    // }
    // if(err.response.code === 500){
    //     console.log('请联系管理员');
    // }
    console.log(err)
    // if (err.response.status === 500) {
    //   return Promise.reject(err)
    // }
    // return err
  }
)

let requests = {
  get: (url, params = {}) => {
    return new Promise((resolve, reject) => {
      httpService({
        url: url,
        method: 'get',
        params: params
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  delete: (url, params = {}) => {
    return new Promise((resolve, reject) => {
      httpService({
        url: url,
        method: 'delete',
        params: params
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  putParam: (url, params = {}) => {
    return new Promise((resolve, reject) => {
      httpService({
        url: url,
        method: 'put',
        params: params
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  putBody: (url, params = {}) => {
    return new Promise((resolve, reject) => {
      httpService({
        url: url,
        method: 'put',
        data: params
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  postBody: (url, params = {}) => {
    return new Promise((resolve, reject) => {
      httpService({
        url: url,
        method: 'post',
        data: params,
        headers: { 'Content-Type': 'application/json' }
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  postParam: (url, params = {}) => {
    return new Promise((resolve, reject) => {
      httpService({
        url: url,
        method: 'post',
        params: params,
        headers: { 'Content-Type': 'application/x-www-form-urlcoded' }
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  postFile: (url, params = {}) => {
    return new Promise((resolve, reject) => {
      httpService({
        url: url,
        method: 'post',
        data: params,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

//7、将模块暴露
export { requests }
