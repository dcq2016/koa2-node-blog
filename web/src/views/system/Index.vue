<template>
  <div>
    <Top />
    <div class="system_box">
      <sideMenus :nowState="nowState" />
      <div class="system_content">
        <Table ref="selection" border :columns="columns" :data="data">
          <template slot-scope="{ row }" slot="action">
            <Button type="primary" disabled size="small" @click="delUser(row)">删除</Button>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>
<script>
import sideMenus from '@/components/system/sideMenus';
import Top from '@/components/system/Top';

export default {
  name: 'index',
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
          title: "用户名",
          key: "username",
          align: "center"
        },
        {
          title: "密码",
          key: "password",
          align: "center"
        },
        {
          title: "角色",
          key: "role",
          align: "center"
        },
        {
          title: "操作",
          align: "center",
          slot: "action",
          width: 120
        }
      ],
      data: [],
      nowState: 0
    }
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      this.$get('/admin/superlist').then(({ data: { isSuccess, data } }) => {
        if (isSuccess) {
          this.data = data;
        } else {
          this.$Message.error(message);
        }
      })
      .catch(err => {
        console.log('err:', err);
      })
    },
    delUser(row, index) {
      console.log(row, index);
      this.$Modal.confirm({
        title: '温馨提示',
        content: '<p>您确定要删除吗？</p>',
        onOk: () => {
          this.$post('/admin/superdelete', {id: row.ID}).then(({ data: { isSuccess, message } }) => {
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
  }
}
</script>
