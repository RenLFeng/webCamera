<!-- 运维管理 父级页面 -->
<template>
  <div id="routerManage" class="router-manage">
    <div class="manage-left">
      <Menu class="manage-menu" :active-name="menuName" @on-select="pageToMenu">
        <MenuItem :name="item.name" v-for="(item, index) in menuList" :key="index">
        <Icon :type="item.icon"></Icon>
        {{ item.text }}
        </MenuItem>
      </Menu>
    </div>
    <router-view @set-manage-menu="getManageMenu"></router-view>
  </div>
</template>

<script>
  export default {
    name: "manageRouter",
    data() {
      return {
        menuName: "deviceType",
        originMenuList: [
          { name: "deviceType", text: "设备类型" },
          { name: "interface", text: "接口管理" },
          { name: "operator", text: "操作员管理" },
          { name: "changePassword", text: "密码修改" },
        ]
      };
    },
    beforeCreate() {
      // 传值给父级main.vue（第二个导航）
      this.$emit("set-active-nav", "system");
    },
    created() { },
    computed:{
      menuList(){
        if(window.localStorage.getItem('userType')==='1'){
          return this.originMenuList;
        }else{
          let tmp=this.originMenuList.slice();
          return tmp.splice(3);
        }
      }, 
      firstMenu(){
        if(!!this.menuList[0]){
          return this.menuList[0].name;
        }
      }
    },
    watch:{
      firstMenu:{
        handler(newName,oldName){
          this.pageToMenu(newName);
        },
        immediate:true
      },
    },
    methods: {
      // 接收从子组件传来的当前选中菜单
      getManageMenu(name) {
        this.menuName = name;
      },
      // 菜单栏跳转
      pageToMenu(name) {
        this.$router.push("/system/" + name);
      }
    }
  };
</script>
<style lang="less">
  /* 这里写整个运维管理的通用样式 */

  .router-manage {
    height: 100%;
    overflow: hidden;
    .manage-left {
      float: left;
      width: 200px;
      height: 100%;
      background-color: #fff;
      .manage-menu {
        width: 200px !important;
        height: 100%;
        padding: 3.5px 0;
        box-shadow: 0 0 1px #eaeaea;
      }
    }
    .manage-right {
      position: relative;
      margin-left: 200px;
      height: 100%;
      overflow: hidden;
      .top-bar {
        height: 53px;
        padding: 9px 20px;
        line-height: 32px;
        background-color: #fff;
        font-size: 16px;
        color: #17233D;
        font-family: PingFangSC-Medium;
      }
      .manage-content {
        position: absolute;
        top: 56px;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 20px;
        overflow: auto;
        h3{
          font-family: PingFangSC-Medium;
        }
        .content {
          box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
          background-color: #fff;
          height: 100%;
          overflow: auto;
          .mytable {
            td,
            th {
              border-bottom: 1px solid rgba(23, 35, 61, 0.10);
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
      }
    }
  }

  .manage-menu .ivu-menu-item-active:not(.ivu-menu-submenu) {
    background: rgba(0, 140, 248, 0.06);
    font-weight: bold;
  }
</style>