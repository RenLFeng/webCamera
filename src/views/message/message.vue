<!-- 消息中心 父级页面 -->
<template>
  <div id="routerMessage" class="router-message" :class="{'no-menu':noMenu}">
    <Menu class="message-menu" :active-name="menuName" @on-select="pageToMenu" mode="horizontal">
      <MenuItem :name="item.name" v-for="(item, index) in menuList" :key="index">{{ item.text }}
      </MenuItem>
    </Menu>
    <router-view class="message-content" @set-message-menu="getMessageMenu" @no-menu="getShowMenu"></router-view>
  </div>
</template>

<script>
  export default {
    name: "messageRouter",
    data() {
      return {
        noMenu: false,
        menuName: "backstage-notice",
        menuList: [
          { name: "backstage-notice", text: "后台公告" },
          { name: "notice-message", text: "通知消息" },
          { name: "user-feedback", text: "用户反馈" }
        ]
      };
    },
    methods: {
      // 接收从子组件传来的当前选中菜单
      getMessageMenu(name) {
        this.menuName = name;
      },
      // 接收从子组件传来的是否显示菜单
      getShowMenu(show) {
        this.noMenu = show;
      },
      // 菜单栏跳转
      pageToMenu(name) {
        this.$router.push("/message/" + name);
      }
    }
  };
</script>
<style lang="less">
  /* 这里写整个消息中心的通用样式 */

  .router-message {
    height: 100%;
    overflow: hidden;
    .message-menu {
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
    .message-content {
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
          height:80px;
          .page {
            float: right;
            margin-top: 14px;
            margin-bottom: 14px;
          }
        }
      }
    }
    &.no-menu {
      .message-menu {
        display: none;
      }
      .message-content {
        top: 0;
      }
    }
  }
</style>