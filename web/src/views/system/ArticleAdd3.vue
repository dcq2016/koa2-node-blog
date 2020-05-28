<template>
  <div>
    <div class="header">
      root 超级管理员 退出
    </div>
    <div class="system_box">
      <div class="system_side">
        <ul>
          <li><img src="@/assets/images/file_icon.png" />账号管理</li>
          <li class="active"><img src="@/assets/images/file_icon-active.png" />文章管理</li>
          <li><img src="@/assets/images/file_icon.png" />评论管理</li>
          <li><img src="@/assets/images/file_icon.png" />个人信息</li>
        </ul>
      </div>
      <div class="system_content">
        <Row>
          <Col span="4">标题</Col>
          <Col span="8"><Input type="text" v-model="title" placeholder="请输入标题" /></Col>
        </Row>
        <Row>
          <Col span="4">描述</Col>
          <Col span="8"><Input type="textarea" v-model="description" :autosize="{minRows: 3, maxRows: 6}" placeholder="请输入描述" /></Col>
        </Row>
        <Row>
          <Col span="4">内容</Col>
          <Col span="20"><mavon-editor v-model="content" style="height:100%;"></mavon-editor></Col>
        </Row>
        <Button type="primary" @click="articleAdd()">添加</Button>
        <Button>重置</Button>
      </div>
    </div>
  </div>
</template>
<script>
import 'mavon-editor/dist/css/index.css';
import { mavonEditor } from 'mavon-editor';

export default {
  components: {
    mavonEditor
  },
  data() {
    return {
      data: [],
      title: '',
      description: '',
      content: ''
    }
  },
  mounted() {
  },
  methods: {
    articleAdd() {
      this.$post('/admin/articleadd', {
        title: this.title,
        description: this.description,
        content: this.content,
      }, { isQs: true }).then(({ data: { isSuccess, data } }) => {
        if (isSuccess) {
          this.$Message.success('新增成功');
          setTimeout(() => {
            this.$router.push({path: '/system/articlelist'});
          }, 1500)
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('请求错误');
      })
    },
    add() {
      this.$router.push({ path: '/system/articleadd' })
    },
    del(row) {
      console.log(row);
    },
  }
}
</script>
<style lang="scss" scoped>
.header {
  background: linear-gradient(159deg, #eb7216, #eb7216 60%, #f09f43);
  height: 64px;
  line-height: 64px;
  color: #fff;
  text-align: right;
  padding: 0 20px;
}
.system_box {
  display: flex;
  flex: 1;
  margin: 10px;
  background: #fff;
  color: #a8b3c4;
  .system_side {
    width: 240px;
    padding: 18px 10px;
    border-right: 1px solid #ecf1f8;

    li {
      padding: 7px 18px;
      list-style: none;
      img {
        width: 16px;
        vertical-align: sub;
        margin-right: 6px;
      }
      &:hover,
      &.active {
        background: #f4f6fa;
        color: #5f5c7f;
        cursor: pointer;
      }
    }
  }
  .system_content {
    flex: 1;
    padding: 20px;
    .ivu-row{
      margin-bottom: 20px;
    }
    .ivu-col-span-4{
      text-align: right;
      padding-right:20px;
    }
  }
}
</style>
