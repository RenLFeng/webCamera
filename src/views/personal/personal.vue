<!-- 个人中心 父级页面 -->
<template>
  <div id="routerPersonal" class="router-personal">
    <Menu class="personal-menu" :active-name="menuName" @on-select="pageToMenu" mode="horizontal">
      <MenuItem :name="item.name" v-for="(item, index) in menuList" :key="index">{{ item.text }}
      </MenuItem>
    </Menu>
    <router-view class="personal-content" @set-personal-menu="getPersonalMenu"></router-view>
  </div>
</template>

<script>
  export default {
    name: "personalRouter",
    data() {
      return {
        menuName: "personal-info",
        menuList: [
          { name: "personal-info", text: "基本信息" },
          { name: "release-records", text: "发布记录" },
          { name: "api-author", text: "云API授权" }
        ]
      };
    },
    methods: {
      // 接收从子组件传来的当前选中菜单
      getPersonalMenu(name) {
        this.menuName = name;
      },
      // 菜单栏跳转
      pageToMenu(name) {
        this.$router.push("/personal/" + name);
      }
    }
  };
</script>
<style lang="less">
  /* 这里写整个个人中心的通用样式 */

  .router-personal {
    height: 100%;
    overflow: hidden;
    .personal-menu {
      height: 56px;
      padding-left: 120px;
      padding-right: 120px;
      line-height: 56px;
      .ivu-menu-item {
        padding: 0;
        margin-right: 32px;
        font-size: 16px;
      }
    }
    .personal-content {
      position: absolute;
      left: 0;
      right: 0;
      top: 56px;
      bottom: 0;
      padding: 20px 120px 30px;
      overflow: auto;
      .box {
        margin-bottom: 20px;
        box-shadow: 0 1px 5px #ccc;
        background-color: #fff;
        height: 100%;
      }
      .box-hd {
        padding: 0 25px;
        font-size: 16px;
        color: #17233d;
        line-height: 56px;
        border-bottom: 1px solid #eaeaea;
      }
      .box-bd {
        .table-box {}
        .mytable {
          td,
          th {
            border-bottom: 1px solid rgba(23, 35, 61, 0.1);
          }
          td {
            padding-top: 13px;
            padding-bottom: 13px;
          }
        }
        .page_container {
          padding-right: 20px;
          .page {
            float: right;
            margin-top: 14px;
            margin-bottom: 14px;
          }
        }
      }
      .pd25 {
        padding: 0 25px;
        .box-hd {
          padding: 0;
        }
      }
    }
  }
</style>