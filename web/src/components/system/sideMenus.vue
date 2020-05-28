<template>
  <div class="system_side">
    <ul>
      <li
        :class="selectIndex == index ? 'active': ''"
        v-for="(item, index) in menuList"
        :key="index"
        @click="ClickHandler(index)"
      ><img src="@/assets/images/file_icon.png" />{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "sideMenus",
  props: {
    nowState: {
      type: Number,
      default: 0
    } //当前选中的tab
  },
  created() {
    this.selectIndex = this.$props.nowState;
  },
  data() {
    return {
      selectIndex: 0,
      menuList: [
        { name: '账号管理', path: '/system/index'},
        { name: '用户管理', path: '/system/userlist'},
        { name: '文章管理', path: '/system/articlelist'},
        { name: '留言管理', path: '/system/messagelist'},
        { name: '评论管理', path: '/system/commentslist'}
      ],
    };
  },
  methods: {
    // 点击改变菜单事件
    ClickHandler(index) {
      if (index !== this.selectIndex) {
        this.selectIndex = index;
        this.$router.push(this.menuList[index].path);
      }
    }
  }
};
</script>
