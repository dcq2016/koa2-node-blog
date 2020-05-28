<template>
  <div>
    <Header :isLogin="isLogin" :user="user" />
    <div class="content">
      <Sidebar />
      <div class="main_content">
        <List item-layout="vertical">
          <ListItem v-for="(item, index) in list" :key="index" @click.native="introDetail(item.ID)">
            <ListItemMeta :title="item.title" :description="item.description" />
            <template slot="action">
              <li>
                <Icon type="ios-timer-outline" /> {{item.createtime}}
              </li>
              <li @click.stop="addLike(item)">
                <Icon type="ios-thumbs-up-outline" /> {{item.mylike}}
              </li>
              <li>
                <Icon type="ios-book-outline" /> {{item.myread}}
              </li>
            </template>
            <template slot="extra" v-if="item.imgurl">
              <img v-lazy="require(`../uploadfiles/${item.imgurl}`)" style="width:280px; height:140px; border-radius:0px;">
            </template>
            <template slot="extra" v-else>
              <img v-lazy="imgUrl" style="width:280px; height:140px; border-radius:0px;">
            </template>
          </ListItem>
        </List>
        <Page :total="total" show-total show-elevator show-sizer :current="pageNo" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { getStorage } from '@/libs/util';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

export default {
  name: 'Home',
  components: {
    Header,
    Sidebar,
    Footer
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      list: [],
      imgUrl: 'https://dev-file.iviewui.com/5wxHCQMUyrauMCGSVEYVxHR5JmvS7DpH/large',
      user: '',
      isLogin: false
    }
  },
  created() {
    const userInfo = getStorage('userInfo');
    if (userInfo && userInfo.user != '') {
      this.user = userInfo.user;
      this.isLogin = true;
    }
  },
  mounted() {
    // this.test();
    // this.banner();
    this.getData();
  },
  methods: {
    banner() {
      this.$get('/banner').then(({ list }) => {
        console.log('list:', list);
      })
    },
    test() {
      let formData = new FormData();
      formData.append("name", "zs");
      formData.append("password", "123456");
      this.$post('/login',
        {
          name: 'zs',
          password: '123456',
          auth: 'dean-test'
        }
      ).then(({ token, code, user }) => {
        if (code) {
          console.log('token:', token);
          console.log('user:', user);
        }
      })
    },
    getData() {
      this.$post('/articlelist', {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then(({ data: { isSuccess, data, total } }) => {
        if (isSuccess) {
          console.log('data', data);
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
    introDetail(id) {
      this.$router.push({ name: 'ArticleDetail', query: { id } });
    },
    addLike(item) {
      this.$post('/article/mylike',{id: item.ID, mylike: item.mylike}).then(({ data: { isSuccess, message } }) => {
        if (isSuccess) {
          this.$Message.success(message);
          this.getData();
        }
      })
    }
  }
}
</script>
