<template>
  <div>
    <div id="nav">
      <router-link to="/">文章</router-link>
      <router-link to="/message">留言板</router-link>
      <!-- <router-link to="/about">about</router-link> -->
      <template v-if="show">
         <div class="member">欢迎您【<span>{{user}}</span>】 <span @click="loginOut">退出</span></div>
      </template>
      <template v-else>
        <div class="member">
          <span class="sign_in" @click="signIn">登录</span>|
          <span class="sign_up" @click="signUp">注册</span>
        </div>
      </template>
    </div>
    <div class="head_wrap">
      <div class="head">
        dean的博客
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    isLogin: {
      type: Boolean,
      default: false
    },
    user: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      show: false
    }
  },
  mounted() {
    this.show = this.$props.isLogin;
  },
  methods: {
    signIn() {
      this.$router.push('/sign_in');
    },
    signUp() {
      this.$router.push('/sign_up');
    },
    loginOut() {
      this.$Modal.confirm({
        title: '温馨提示',
        content: '您确定要退出吗',
        onOk: () => {
          window.localStorage.clear();
          this.show = false;
          this.$emit('onOut', true);
        }
      })
    }
  }
}
</script>
