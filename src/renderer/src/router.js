import { createRouter, createWebHashHistory } from 'vue-router'
import { userStore } from '@/store/user'

// 路由列表
const routes = [
  {
    path: '/',
    name: 'init',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('./views/login/Login.vue'),
    meta: {
      title: '登录界面',
      needLogin: false
    }
  },
  {
    path: '/register',
    component: () => import('./views/register/Register.vue'),
    meta: {
      title: '注册界面',
      needLogin: false
    }
  },
  {
    path: '/objects',
    component: () => import('./views/objects/Objects.vue'),
    meta: {
      title: '文件列表',
      needLogin: true
    }
  }
  // {
  //   path: '/home',
  //   component: () => import('./views/home/Home.vue'),
  //   meta: {
  //     title: '主页',
  //     needLogin: true
  //   }
  // }
  // {
  //   path: '/entrance',
  //   name: 'Entrance',
  //   component: () => import('@/pages/entrance/Entrance.vue'),
  //   meta: {
  //     title: '清风诗词',
  //     needLogin: false
  //   },
  //   children: [
  //     {
  //       path: 'login',
  //       component: () => import('@/pages/entrance/components/LoginForm.vue'),
  //       meta: {
  //         title: '登录界面',
  //         needLogin: false
  //       }
  //     },
  //     {
  //       path: 'register',
  //       component: () => import('@/pages/entrance/components/RegisterForm.vue'),
  //       meta: {
  //         title: '注册界面',
  //         needLogin: false
  //       }
  //     },
  //     {
  //       path: 'forget-password',
  //       component: () => import('@/pages/entrance/components/ForgetPasswordForm.vue'),
  //       meta: {
  //         title: '忘记密码',
  //         needLogin: false
  //       }
  //     }
  //   ]
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const uStore = userStore()
  //获取一下角色
  // 需要鉴权
  if (to.meta.needLogin != null && to.meta.needLogin == true) {
    if (uStore.token != null) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

// 导出路由
export default router
