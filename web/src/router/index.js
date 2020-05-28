import Vue from 'vue'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Home from '../views/Home.vue'
import { getStorage } from "@/libs/util"

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/article',
    name: 'ArticleDetail',
    component: () => import('../views/ArticleDetail')
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('../views/Message')
  },
  { // 注册
    path: '/sign_up',
    name: 'Signup',
    component: () => import('../views/Signup')
  },
  { // 登录
    path: '/sign_in',
    name: 'Signin',
    component: () => import('../views/Signin')
  },
  {
    path: '/system/login',
    name: 'Login',
    component: () => import('../views/system/Login')
  },
  {
    path: '/system/index',
    name: 'Index',
    component: () => import('../views/system/Index')
  },
  {
    path: '/system/userlist',
    name: 'UserList',
    component: () => import('../views/system/UserList')
  },
  {
    path: '/system/articlelist',
    name: 'ArticleList',
    component: () => import('../views/system/ArticleList')
  },
  {
    path: '/system/articleadd',
    name: 'ArticleAdd',
    component: () => import('../views/system/ArticleAdd')
  },
  {
    path: '/system/messagelist',
    name: 'MessageList',
    component: () => import('../views/system/MessageList')
  },
  {
    path: '/system/commentslist',
    name: 'CommentsList',
    component: () => import('../views/system/CommentsList')
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})

router.beforeEach((to, from, next) => {
  // NProgress.start()
  iView.LoadingBar.start();
  // let token = getStorage('Authorization');
  // if (token) {
  //   next()
  // } else {
  //   if (to.path == '/system/login') {
  //     next();
  //   } else {
  //     router.replace('/system/login');
  //   }
  // }
  next();

})
router.afterEach(() => {
  // NProgress.done()
  iView.LoadingBar.finish();
})

export default router