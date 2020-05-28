import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './libs/ajax'
import ViewUI from 'view-design'
// import 'view-design/dist/styles/iview.css'
import './my-theme/index.less'
import VueLazyload from 'vue-lazyload'
// import NProgress from 'nprogress' // 进度条
// import 'nprogress/nprogress.css' // 这个样式必须引入


// NProgress.inc(0.2)
// NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })


Vue.use(ViewUI);
Vue.config.productionTip = false

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/images/author.jpeg'),
  loading: require('./assets/images/loading.gif'),
  attempt: 1,
  // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
  listenEvents: [ 'scroll' ]
});

Vue.prototype.$get = axios.get;
Vue.prototype.$post = axios.post;
Vue.prototype.$file = axios.file;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
