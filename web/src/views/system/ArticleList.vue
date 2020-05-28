<template>
  <div>
    <Top />
    <div class="system_box">
      <sideMenus :nowState="nowState" />
      <div class="system_content">
        <div class="title">
          <Button type="primary" size="default" @click="add">新增</Button>
        </div>
        <Table ref="selection" border :columns="columns" :data="data">
          <template slot-scope="{ row }" slot="imgurl">
            <span v-if="row.imgurl && row.imgurl != 'undefined' && row.imgurl != 'null'"><img :src="require(`../../uploadfiles/${row.imgurl}`)" style=" width:100px; height:100px; margin-top:10px;"></span>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" @click="del(row, index)">删除</Button>
            <Button type="primary" size="small" @click="modify(row)" style=" margin-left:10px;">修改</Button>
          </template>
        </Table>
        <Page :total="total" show-total show-elevator show-sizer :current="pageNo" :page-size="pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </div>
    </div>
  </div>
</template>
<script>
import sideMenus from '@/components/system/sideMenus';
import Top from '@/components/system/Top';

export default {
  name: 'articleList',
  components: {
    sideMenus,
    Top
  },
  data() {
    return {
      columns: [
        {
          title: "ID",
          key: "ID",
          align: "center",
          width: 80
        },
        {
          title: "标题",
          key: "title"
        },
        {
          title: "封面图片",
          slot: "imgurl"
        },
        {
          title: "描述",
          key: "description"
        },
        {
          title: "点赞数",
          key: "mylike",
          width: 80
        },
        {
          title: "浏览量",
          key: "myread",
          width: 80
        },
        {
          title: "创建时间",
          key: "createtime"
        },
        {
          title: "操作",
          align: "center",
          slot: "action",
          width: 200
        }
      ],
      data: [],
      nowState: 2,
      pageNo: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getArticleListData();
  },
  methods: {
    getArticleListData() {
      this.$post('/admin/articlelist', {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then(({ data: { isSuccess, data, total } }) => {
        if (isSuccess) {
          this.data = data;
          this.total = total;
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 页码改变的回调，返回改变后的页码
    pageChange(value) {
      this.pageNo = value;
      this.getArticleListData();
    },
    // 切换每页条数时的回调，返回切换后的每页条数
    pageSizeChange(value) {
      this.pageSize = value;
      this.getArticleListData();
    },
    add() {
      this.$router.push({path: '/system/articleadd'})
    },
    del(row, index) {
      console.log(row, index);
      this.$Modal.confirm({
        title: '温馨提示',
        content: '<p>您确定要删除吗？</p>',
        onOk: () => {
          this.$post('/admin/articledel', {id: row.ID}).then(({ data: { isSuccess, message } }) => {
            if (isSuccess) {
              this.$Message.success(message);
              this.data.splice(index, 1);
            }
          })
        },
        onCancel : () => {

        },
      })
    },
    modify(row) {
      this.$router.push({path: '/system/articleadd', query: {id: row.ID}})
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
    .title{
      margin-bottom: 20px;
    }
  }
}
</style>
