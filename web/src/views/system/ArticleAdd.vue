<template>
  <div>
    <Top />
    <div class="system_box">
      <sideMenus :nowState="nowState" />
      <div class="system_content">
        <Row>
          <Col span="2">标题</Col>
          <Col span="8"><Input type="text" v-model="title" placeholder="请输入标题" /></Col>
        </Row>
         <Row>
          <Col span="2">封面图片</Col>
          <Col span="8"><input type="file" @change="changeHandler" placeholder="请上传封面图片" /></Col>
        </Row>
        <Row>
          <Col span="2">描述</Col>
          <Col span="8"><Input type="textarea" v-model="description" :autosize="{minRows: 3, maxRows: 6}" placeholder="请输入描述" /></Col>
        </Row>
        <Row>
          <Col span="2">点赞</Col>
          <Col span="8"><Input type="number" v-model="mylike" placeholder="请输入点赞数" /></Col>
        </Row>
        <Row>
          <Col span="2">阅读量</Col>
          <Col span="8"><Input type="number" v-model="myread" placeholder="请输入阅读量" /></Col>
        </Row>
        <Row>
          <Col span="2">内容</Col>
          <Col span="20">
          <!-- <quill-editor v-model="content"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
                >
            </quill-editor> -->
          <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption" style=" height:400px;">
          </quill-editor>
          </Col>
        </Row>
        <Row style=" margin-top:80px;">
          <Col span="2">...</Col>
          <Col span="20">
            <template v-if="id">
              <Button type="primary" @click="modify">修改</Button>&nbsp;&nbsp;&nbsp;<Button @click="cancel">取消</Button>
            </template>
            <template v-else>
              <Button type="primary" @click="add">添加</Button>&nbsp;&nbsp;&nbsp;<Button @click="reset">重置</Button>
            </template>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import { quillEditor } from 'vue-quill-editor';
import sideMenus from '@/components/system/sideMenus';
import Top from '@/components/system/Top';

export default {
  name: 'articleadd',
  components: {
    quillEditor,
    sideMenus,
    Top
  },
  data() {
    return {
      id: '',
      title: '',
      imgurl: '',
      description: '',
      mylike: 0,
      myread: 0,
      content: '',
      editorOption: {},
      nowState: 1
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getArticleDetail();
    }
  },
  mounted() {

  },
  methods: {
    getArticleDetail() {
      this.$get(`/article/detail/${this.id}`).then(({ data: { isSuccess, data, message } }) => {
        if (isSuccess) {
          console.log('data', data[0]);
          this.title = data[0].title;
          this.imgurl = data[0].imgurl;
          this.description = data[0].description;
          this.mylike = data[0].mylike;
          this.myread = data[0].myread;
          this.content = data[0].content;
        } else {
          this.$Message.error(message);
          setTimeout(() => {
            this.$router.replace('/system/articlelist');
          }, 1500)
        }
      })
    },
    changeHandler() {
      let reader = new FileReader();
      let img = event.target.files[0];
      let type = img.type; //文件的类型，判断是否是图片
      let size = img.size; //文件的大小，判断图片的大小

      console.log('img:', img);

      let form = new FormData(); 
      form.append('avatar', img);
      this.$file('/uploadfile', form).then(({ data: { isSuccess, message, filename }, status }) => {
        if (status == 200 && isSuccess) {
          this.imgurl = filename;
        }
      }).catch(err => {
        console.log('err:', err);
      })

    },
    // 新增
    add() {
      this.$post('/admin/articleadd', {
        title: this.title,
        imgurl: this.imgurl,
        description: this.description,
        mylike: this.mylike,
        myread: this.myread,
        content: this.content,
      }, {
        isQs: true
      }).then(({ data: { isSuccess, data } }) => {
        if (isSuccess) {
          this.$Message.success('新增成功');
          setTimeout(() => {
            this.$router.push({ path: '/system/articlelist' });
          }, 1500)
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error('请求错误');
      })
    },
    // 修改
    modify() {
      this.$post(`/admin/articlemodify`, {
        id: this.id,
        title: this.title,
        imgurl: this.imgurl,
        description: this.description,
        mylike: this.mylike,
        myread: this.myread,
        content: this.content,
      }, {
        isQs: true
      }).then(({ data: { isSuccess, message } }) => {
        if (isSuccess) {
          this.$Message.success(message);
          setTimeout(() => {
            this.$router.push({ path: '/system/articlelist' });
          }, 1500)
        }
      }).catch(err => {
        console.log(err);
      })
    },
    reset() {
      this.title = '';
      this.description = '';
      this.content = '';
    },
    cancel() {
      this.$router.push('/system/articlelist');
    },
    del(row) {
      console.log(row);
    }
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
    .ivu-row {
      margin-bottom: 20px;
    }
    .ivu-col-span-2 {
      text-align: right;
      padding-right: 20px;
    }
  }
}
</style>
