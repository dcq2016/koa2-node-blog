<template>
  <div>
    <!-- <Spin size="large"></Spin> -->
    <Header :isLogin="isLogin" :user="user" />
    <div class="content">
      <Sidebar />
      <div class="main_content">
        <div class="message-commit">
          <div class="message-item">
            <p><Input type="textarea" maxlength="200" :show-word-limit="true" :rows="7" v-model="content" placeholder="请输入留言内容" /></p>
          </div>
          <div class="message-item">
            <Button type="info" @click="submit" :disabled="disabled">提交</Button><Button class="ml20" @click="reset">重置</Button>
          </div>
        </div>

        <List item-layout="vertical">
          <ListItem v-for="(item, index) in list" :key="index">
            <ListItemMeta v-if="item.avatar" :avatar="require(`../uploadfiles/${item.avatar}`) || defaultAvatar" :title="item.username" :description="item.content" />
            <ListItemMeta v-else :avatar="defaultAvatar" :title="item.username" :description="item.content" />
            <template slot="action">
              <li>
                <Icon type="ios-timer-outline" /> {{item.createtime}}
              </li>
            </template>
            <!-- <template slot="extra">
              <img src="https://dev-file.iviewui.com/5wxHCQMUyrauMCGSVEYVxHR5JmvS7DpH/large" style="width: 280px">
            </template> -->
          </ListItem>
        </List>
        <Page v-show="list.length" :total="total" show-total show-elevator show-sizer :current="pageNo" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { verifyEmail, getStorage } from '@/libs/util';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';


export default {
  name: 'message',
  components: {
    Header,
    Sidebar,
    Footer
  },
  data() {
    return {
      user: '',
      avatar: '', // 头像
      isLogin: false,
      content: '',
      list: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      disabled: false,
      defaultAvatar: 'https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar'
    }
  },
  created() {
    const userInfo = getStorage('userInfo');
    if (userInfo && userInfo.user != '') {
      this.user = userInfo.user;
      this.avatar = userInfo.avatar;
      this.isLogin = true;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$Spin.show();
      this.$post('/messagelist', {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then(({ data: { isSuccess, data, total } }) => {
        this.$Spin.hide();
        if (isSuccess) {
          this.list = data;
          this.total = total;
        }
      })
    },
    // 页码改变的回调，返回改变后的页码
    pageChange(value) {
      this.pageNo = value;
      this.getData();
    },
    // 切换每页条数时的回调，返回切换后的每页条数
    pageSizeChange(value) {
      this.pageSize = value;
      this.getData();
    },
    submit() {
      if (!this.isLogin) {
        this.$Message.error('您还没有登录,请先行登录');
        setTimeout(() => {
          this.$router.push('/sign_in');
        }, 1000)
      }
      if (this.content == '') {
        return this.$Message.error('请输入留言内容');
      }
      this.disabled = true;
      // this.$Spin.show();
      this.$post('/message/add', {
        username: this.user,
        avatar: this.avatar,
        content: this.content
      }).then(({ data: { isSuccess, message } }) => {
        if (isSuccess) {
          this.$Message.success(message);
          setTimeout(() => {
            this.reset();
            this.getData();
            // this.$Spin.hide();
            this.disabled = false;
          }, 1500)
        }
      })
    },
    reset() {
      this.content = '';
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
