<template>
  <div>
    <Top />
    <div class="system_box">
      <sideMenus :nowState="nowState" />
      <div class="system_content">
        <Table ref="selection" border :columns="columns" :data="data">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" @click="delMessage(row, index)">删除</Button>
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
  name: 'messageList',
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
          title: "昵称",
          key: "username"
        },
        {
          title: "留言内容",
          key: "content",
          width: 400
        },
        {
          title: "创建时间",
          key: "createtime"
        },
        {
          title: "操作",
          align: "center",
          slot: "action",
          width: 100
        }
      ],
      data: [],
      nowState: 3,
      pageNo: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$post('/admin/messagelist', {
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
      this.getData();
    },
    // 切换每页条数时的回调，返回切换后的每页条数
    pageSizeChange(value) {
      this.pageSize = value;
      this.getData();
    },
    delMessage(row, index) {
      console.log(row, index);
      this.$Modal.confirm({
        title: '温馨提示',
        content: '<p>您确定要删除吗？</p>',
        onOk: () => {
          this.$post('/admin/messagedel', {id: row.ID}).then(({ data: { isSuccess, message } }) => {
            if (isSuccess) {
              this.$Message.success(message);
              this.data.splice(index, 1);
            }
          })
        },
        onCancel : () => {

        },
      })
    }
  }
}
</script>