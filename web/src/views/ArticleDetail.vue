<template>
  <div>
    <Header :isLogin="isLogin" :user="user" @onOut="loginOut" />
    <div class="content">
      <Sidebar />
      <div class="main_content">
        <div class="artile_detail">
          <div class="title">{{articleDetail.title}}</div>
          <div class="desc">
            <Icon type="ios-timer-outline" /> {{articleDetail.createtime}}
            <Icon type="ios-thumbs-up-outline" /> {{articleDetail.mylike}}
            <Icon type="ios-book-outline" /> {{articleDetail.myread}}
          </div>
          <div class="info" v-html="articleDetail.content"></div>
        </div>
        <div class="message-commit">
          <div class="message-item">
            <p><Input type="textarea" maxlength="200" :show-word-limit="true" :rows="7" v-model="content" placeholder="请输入评论内容" /></p>
          </div>
          <div class="message-item">
            <Button type="info" @click="submit" :disabled="disabled">评论</Button><Button class="ml20" @click="reset">重置</Button>
          </div>
        </div>
        <List item-layout="vertical">
          <ListItem v-for="(item, index) in commentsList" :key="index">
            <ListItemMeta :avatar="require(`../uploadfiles/${item.avatar}`)" :title="item.username" :description="item.content" />
            <template slot="action">
              <li>
                <Icon type="ios-timer-outline" /> {{item.createtime}}
              </li>
              <li>
                <Icon type="ios-thumbs-up-outline" /> 点赞数 {{item.mylike}}
              </li>
              <li v-if="user == item.username" style=" cursor:no-drop;">
                <Icon type="ios-chatboxes" /> 回复
              </li>
              <li @click="reply($event)" v-else>
                <Icon type="ios-chatboxes" /> 回复
              </li>
            </template>
            <template slot="extra">
              <div class="message-commit hide" style=" margin:20px 0 0;">
                <div class="message-item">
                  <p><Input type="textarea" maxlength="200" :show-word-limit="true" :rows="7" v-model="replycontent" placeholder="请输入回复内容" /></p>
                </div>
                <div class="message-item">
                  <Button @click="submitReply(item.ID)" :disabled="disabled">回复</Button><Button class="ml20" @click="resetReply">取消</Button>
                </div>
              </div>
            </template>

            <template slot="extra" v-if="item.list && item.list.length" >
            <div class="list" v-for="(items, k) in item.list" :key="k">
              <div class="list-top">
                <img class="img" :src="require(`../uploadfiles/${items.avatar}`)" />
                <div class="list-content">
                  <div class="title">{{items.username}}</div>
                  <div class="description">{{items.content}}</div>
                </div>
              </div>
              <div class="list-bottom"><Icon type="ios-timer-outline" />{{items.createtime}}</div>
            </div>
            </template>
          </ListItem>
        </List>
        <Page v-show="commentsList.length" :total="total" show-total show-elevator show-sizer :current="pageNo" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </div>
    </div>
  </div>
</template>

<script>
import { getStorage } from '@/libs/util';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default {
  name: 'ArticleDetail',
  components: {
    Header,
    Sidebar
  },
  data() {
    return {
      user: '',
      isLogin: false,
      articleDetail: {},
      myread: 0,
      content: '',
      replycontent: '',
      disabled: false,
      commentsList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0
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
    this.init();
  },
  methods: {
    async init() {
      console.log('id:', this.$route.query.id);
      try {
        const data = await this.getArticleDetail();
        const { commentsList, total } = await this.getArticleComments();
        console.log('data:', data);
        this.articleDetail = data;
        this.myread = data.myread;
        this.commentsList = commentsList;
        this.total = total;
        await this.$post(`/article/myread`, { id: this.$route.query.id, myread: this.myread }).then(({ data: { isSuccess, message } }) => {
          if (isSuccess) {
            console.log('success:', message);
          }
        })
      } catch (error) {
        this.$Message.error(error);
        console.log('失败了：' + error)
        setTimeout(() => {
          this.$router.replace('/');
        }, 1500);
      }
    },
    async commentsData() {
      const { commentsList, total } = await this.getArticleComments();
      this.commentsList = commentsList;
      this.total = total;
    },
    getArticleDetail() {
      return new Promise((resolve, reject) => {
        this.$get(`/article/detail/${this.$route.query.id}`).then(({ data: { isSuccess, message, data, total } }) => {
          if (isSuccess) {
            resolve(data[0]);
          } else {
            reject(message)
          }
        })
      })
    },
    getArticleComments() {
      return new Promise((resolve, reject) => {
        this.$post('/comments', {
          articleId: this.$route.query.id,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }).then(({ data: { isSuccess, message, data: commentsList, total } }) => {
          if (isSuccess) {
            resolve({ commentsList, total })
          } else {
            reject(message);
          }
        })
      })
    },
    submit() {
      if (!this.isLogin) {
        this.$Message.error('您还没有登录,请先行登录');
        setTimeout(() => {
          this.$router.push('/sign_in');
        }, 1000)
        return;
      }
      if (this.content == '') {
        return this.$Message.error('请输入评论内容');
      }
      this.disabled = true;
      this.$post('/comments/add', {
        username: this.user,
        avatar: this.avatar,
        articleId: this.$route.query.id,
        articleTitle: this.articleDetail.title,
        content: this.content
      }).then(({ data: { isSuccess, message } }) => {
        if (isSuccess) {
          this.$Message.success(message);
          setTimeout(() => {
            this.reset();
            this.commentsData();
            this.disabled = false;
          }, 1500)
        }
      })
    },
    reset() {
      this.content = '';
    },
    // 页码改变的回调，返回改变后的页码
    pageChange(value) {
      this.pageNo = value;
      this.commentsData();
    },
    // 切换每页条数时的回调，返回切换后的每页条数
    pageSizeChange(value) {
      this.pageSize = value;
      this.commentsData();
    },
    loginOut(data) {
      console.log('data:', data);
      if (data) {
        this.user = '';
        this.isLogin = false;
      }
    },
    reply(event) {
      console.log('event:', event.path, event.currentTarget.parentElement.parentElement.parentElement);
      let parent =  event.currentTarget.parentElement.parentElement.parentElement;

      console.log(parent.getAttribute('class'));
      if (parent.getAttribute('class') == 'ivu-list-item') {
        parent.setAttribute('class', 'ivu-list-item active');
      } else {
        parent.setAttribute('class', 'ivu-list-item');
      }
      
    },
    submitReply(ID) {
      let parent = event.currentTarget.parentElement.parentElement.parentElement.parentElement;

      if (!this.isLogin) {
        this.$Message.error('您还没有登录,请先行登录');
        setTimeout(() => {
          this.$router.push('/sign_in');
        }, 1000)
        return;
      }
      if (this.replycontent == '') {
        return this.$Message.error('请输入回复内容');
      }
      this.disabled = true;
      this.$post('/comments/reply', {
        username: this.user,
        avatar: this.avatar,
        articleId: this.$route.query.id,
        articleTitle: this.articleDetail.title,
        replyId: ID,
        content: this.replycontent
      }).then(({ data: { isSuccess, message } }) => {
        if (isSuccess) {
          this.$Message.success(message);
          parent.setAttribute('class', 'ivu-list-item');
          setTimeout(() => {
            this.replycontent = '';
            this.commentsData();
            this.disabled = false;
          }, 1500)
        } else {
          this.disabled = false;
          this.$Message.warning(message);
        }
      })
    },
    resetReply() {
      this.replycontent = '';
      let parent = event.currentTarget.parentElement.parentElement.parentElement.parentElement;
      parent.setAttribute('class', 'ivu-list-item');
    },
  }
}
</script>
<style lang="scss" scoped>
.ivu-list-vertical .ivu-list-item-extra {
    margin-left: 0px;
    .hide{
      display:none;
    }
}
.active{
  .ivu-list-item-extra .hide{
    display:block;
  }
}
.ivu-list-item{
  display: block;
}
.list{
  margin:10px 0;
  border:1px dashed #f1f1f1;
  border-radius: 0;
  color: rgba(0, 0, 0, 0.45);
  .list-top{
    display: flex;
    margin-bottom:10px;
    .img{
      width:50px;
      height:50px;
      border-radius:50%;
    }
    .list-content{
      flex:1;
      margin-left:20px;
      .title{ 
        color:#333;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .description{
        line-height: 24px;
      }
    }
  }
  .list-bottom{
    line-height: 24px;
  }
}
</style>>