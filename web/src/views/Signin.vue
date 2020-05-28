<template>
  <div class="login-box">
    <div class="title"><span class="active">登录</span><span @click="signUp">注册</span></div>
    <Input type="text" v-model="username" placeholder="请输入用户名" />
    <Input type="password" v-model="password" placeholder="请输入密码" />
    <Button type="primary" class="login-btn" @click="login">登录</Button>
  </div>
</template>
<script>
import { md5, setStorage } from '@/libs/util';

export default {
  name: 'Signin',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      if (this.username == '') {
        return this.$Message.error('请输入用户名');
      }
      if (this.password == '') {
        return this.$Message.error('请输入密码');
      }
      const params = {
        username: this.username,
        password: md5(this.password)
      }
      this.$post('/sign_in', params).then(({ data: { isSuccess, message, avatar } }) => {
        if (isSuccess) {
          this.$Message.success(message);
          setStorage('userInfo', {user: this.username, avatar})
          setTimeout(() => {
            this.$router.go(-1);
          }, 1500);
        } else {
          this.$Message.error(message);
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('请求错误');
      })
    },
    signUp() {
      this.$router.push('/sign_up');
    }
  }
}
</script>
<style lang="scss" scoped>
.login-box {
  width: 400px;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin: 100px auto;
  padding: 10px 50px 50px;
  background:#fff;
  .title {
    font-size: 20px;
    text-align: center;
    line-height: 60px;
    margin-bottom: 10px;
    color: #999;
    span{
      margin:0 10px;
      padding-bottom: 5px;
      &.active{
        color:#EB7216;
        border-bottom: 2px solid #EB7216;
      }
    }
    
  }
  .ivu-input-wrapper {
    margin-bottom: 20px;
  }
  .login-btn {
    width: 100%;
    height: 40px;
  }
}
</style>
