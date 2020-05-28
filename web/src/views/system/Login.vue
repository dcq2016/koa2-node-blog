<template>
  <div class="login-box">
    <div class="title">User Login</div>
    <Input type="text" v-model="username" placeholder="请输入用户名" />
    <Input type="password" v-model="password" placeholder="请输入密码" />
    <Button type="primary" class="login-btn" @click="login">登录</Button>
  </div>
</template>
<script>
import { md5, setStorage } from '@/libs/util';

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      const params = {
        username: this.username,
        password: md5(this.password)
      }
      this.$post('/admin/login', params).then(({ data: { isSuccess, message, token } }) => {
        if (isSuccess) {
          this.$Message.success(message);
          setStorage('Authorization', token)
          setTimeout(() => {
              this.$router.push({name: 'Index'});
          },1500);
        } else {
          this.$Message.error(message);
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('请求错误'+err);
      })
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
    font-size: 26px;
    text-align: center;
    line-height: 60px;
    margin-bottom: 10px;
    color: #999;
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
