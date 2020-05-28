<template>
  <div class="login-box">
    <div class="title"><span @click="signIn">登录</span><span class="active">注册</span></div>
    <Input type="text" v-model="username" placeholder="请输入用户名" />
    <Input type="text" v-model="phone" placeholder="请输入手机号码" />
    <Input type="password" v-model="password" placeholder="请输入密码" />
    <input type="file" @change="changeHandler" placeholder="请上传头像" />
    <Button type="primary" class="login-btn" @click="submit">注册</Button>
  </div>
</template>
<script>
import { md5, setStorage, verifyPhone } from '@/libs/util';

export default {
  name: 'Signup',
  data() {
    return {
      username: '',
      phone: '',
      password: '',
      filename: '' // 用户头像
    }
  },
  methods: {
    // 1.图片上传，先上传图片，图片上传成功后返回图片名称（需要node接口处理图片上传）
    // 2.注册时再保存用户信息（包含用户头像图片名)
    changeHandler(event) {
      let reader = new FileReader();
      let img = event.target.files[0];
      let type = img.type; //文件的类型，判断是否是图片
      let size = img.size; //文件的大小，判断图片的大小

      console.log('img:', img);

      let form = new FormData(); 
      form.append('avatar', img);
      this.$file('/uploadfile', form).then(({ data: { isSuccess, message, filename }, status }) => {
        if (status == 200 && isSuccess) {
          this.filename = filename;
        }
      }).catch(err => {
        console.log('err:', err);
      })

    },
    submit() {
      if (this.username == '') {
        return this.$Message.error('请输入用户名');
      }
      if (this.phone == '') {
        return this.$Message.error('请输入手机号');
      } else if (!verifyPhone(this.phone)) {
        return this.$Message.error('请输入正确的手机号');
      }
      if (this.password == '') {
        return this.$Message.error('请输入密码');
      }
      if (this.filename == '') {
        return this.$Message.error('请先上传用户头像');
      }
      const params = {
        username: this.username,
        phone: this.phone,
        password: md5(this.password),
        avatar: this.filename
      }
      this.$post('/sign_up', params).then(({ data: { isSuccess, message, token } }) => {
        if (isSuccess) {
          this.$Message.success(message);
          setTimeout(() => {
            this.$router.push({ name: 'Signin' });
          }, 1500);
        } else {
          this.$Message.error(message);
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('请求错误');
      })
    },
    signIn() {
      this.$router.push('/sign_in');
    },
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
