<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div class="top-header">
      <Menu mode="horizontal" :active-name="activeNav" @on-select="pageToNav">
        <Row>
          <Col span="4">
          <div class="layout-logo">
            <img src="../images/logo_small.png" alt="" @click="goHome">
          </div>
          </Col>
          <Col span="16" style="text-align:center;">
          <ul class="layout-nav">
            <MenuItem :name="item.name" v-for="(item, index) in navList" :key="index">{{ item.text }}
            </MenuItem>
          </ul>
          </Col>
          <Col span="4" style="text-align:right;">
          <div class="header-avator-con">
            <!-- <div class="user-dropdown-menu-con">
              <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon"> -->
            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown" style="position: absolute;right:22px;">
              <Avatar icon="android-person" style="background:rgba(255, 255, 255, 0.7);position:absolute;right:20px;top:18px;" size="small"
              />
              <a href="javascript:void(0)">
                <Icon type="chevron-down" :size="14" style="color: rgba(255,255,255,0.55);"></Icon>
              </a>
              <DropdownMenu slot="list" placement="bottom-end">
                <DropdownItem name="loginout" divided>
                  <Icon type="log-out" class="icon"></Icon>退出登录
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <!-- </Row>
            </div> -->
          </div>
          </Col>
        </Row>
      </Menu>
    </div>
    <div class="mid-content">
      <keep-alive include="old_home">
        <router-view @set-active-nav="getActiveNav"></router-view>
        <div class="error" v-if="!!showError.code">{{showError.text}}</div>
      </keep-alive>
    </div>
  </div>
</template>
<script>
  import shrinkableMenu from "./main-components/shrinkable-menu/shrinkable-menu.vue";
  import tagsPageOpened from "./main-components/tags-page-opened.vue";
  import fullScreen from "./main-components/fullscreen.vue";
  import lockScreen from "./main-components/lockscreen/lockscreen.vue";
  import messageTip from "./main-components/message-tip.vue";
  import themeSwitch from "./main-components/theme-switch/theme-switch.vue";
  import Cookies from "js-cookie";
  import util from "@/libs/util.js";
  import scrollBar from "@/views/my-components/scroll-bar/vue-scroller-bars";
  import { mapState } from 'vuex';

  export default {
    components: {
      shrinkableMenu,
      tagsPageOpened,
      fullScreen,
      lockScreen,
      messageTip,
      themeSwitch,
      scrollBar
    },
    data() {
      return {
        activeNav: "maintain",
        originNavList: [
          {
            name: "maintain",
            text: "日常维护"
          },
          {
            name: "manage",
            text: "运维管理"
          },
          {
            name: "system",
            text: "系统设置"
          },
        ],
        developerID: window.localStorage.getItem('developerID'),
        pageObj1: {
          total: 0,
          current: 1,
          size: 10000
        },
        msgs: {
          bulletin: [],
          message: [],
          feedback: []
        },
        sidebarPage: false,
        tagsShow: false,
        shrink: true,
        userName: "",
        isFullScreen: false,
        openedSubmenuArr: this.$store.state.app.openedSubmenuArr
      };
    },
    computed: {
      ...mapState(['showError']),
      menuList() {
        return this.$store.state.app.menuList;
      },
      pageTagsList() {
        return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
      },

      avatorPath() {
        return localStorage.avatorImgPath;
      },
      cachePage() {
        return this.$store.state.app.cachePage;
      },
      lang() {
        return this.$store.state.app.lang;
      },
      menuTheme() {
        return this.$store.state.app.menuTheme;
      },
      navList(){
        if(window.localStorage.getItem('userType')==='1'||window.localStorage.getItem('userType')==='3'){
          return this.originNavList;
        }else{
          return this.originNavList.slice(1);
        }
      }, 
    },
    methods: {
      // 接收从子组件传来的当前选中导航
      getActiveNav(num) {
        this.activeNav = num;
      },
      // 导航跳转
      pageToNav(name) {
        this.$router.push("/" + name);
      },
      goHome(){
        this.$router.push('/maintain/todayControl');
      },
      init() {
        let pathArr = util.setCurrentPath(this, this.$route.name);
        this.$store.commit("updateMenulist");
        if (pathArr.length >= 2) {
          this.$store.commit("addOpenSubmenu", pathArr[1].name);
        }
        this.userName = Cookies.get("user");
        let messageCount = 3;
        this.messageCount = messageCount.toString();
        this.checkTag(this.$route.name);
        this.$store.commit("setMessageCount", 3);
      },
      clearMsg(key) {
        event.stopPropagation();
        let that = this;
        let type = null;
        if (key == 'bulletin') {
          type = 1;
        } else if (key == 'message') {
          type = 2;
        } else {
          type = 3;
        }
        let data = {
          devID: this.developerID,
          type: type,
        };
        this.axios.get(this.api.allread, { data }).then(res => {
          console.log(res, '根据不同的种类设置为已读');
          if (res.result == '1') {
            that.getMsgs();
          }
        }).catch(err => {
          console.log(err);
        });
      },
      //转换为几小时前
      convertHourAgo(time) {
        let time1 = new Date(time).getTime();
        let time2 = new Date().getTime();
        if (time1 > time2) {
          return;
        } else {
          let ms = time2 - time1;
          let hour = Math.round(ms / (1000 * 60 * 60));
          let long = hour + '小时前';
          return long;
        }
      },
      hover() {
        console.log("messge-tip hover");
        this.getMsgs();
      },
      toggleClick() {
        this.shrink = !this.shrink;
      },
      handleClickUserDropdown(name) {
        if (name === "ownSpace") {
          // util.openNewPage(this, "ownspace_index");
          this.$router.push('/personal');
        } else if (name === "publishRecord") {
          this.$router.push('/personal/release-records');
        } else if (name === "cloudAuthorization") {
          this.$router.push('/personal/api-author');
        } else if (name === "loginout") {
          /* this.$axios({
            baseURL: this.api.baseURL,
            url: this.api.logout + '?access_token=' + window.localStorage.getItem('token'),
            method: 'DELETE',
          }).then(res => {
            console.log(res);
            // 退出登录
            window.localStorage.clear();
            this.$store.commit("logout", this);
            this.$store.commit("clearOpenedSubmenu");
            this.$router.push({
              name: "login"
            });
          }).catch(err => {
            console.log(err);
          }); */
          const that=this;
          that.axios.post(that.api.logout,{}).then(res => {
            console.log(res.result);
            if (res.result==='true') {
              that.$Message.success('退出登录成功！');
              window.localStorage.clear();
              this.$store.commit("logout", this);
              this.$store.commit("clearOpenedSubmenu");
              this.$router.push({
                name: "login"
              });
            }else{
              console.log(res.message);
            }
          }).catch(err => {
            console.log(err);
          }); 
        }
      },
      checkTag(name) {
        let openpageHasTag = this.pageTagsList.some(item => {
          if (item.name === name) {
            return true;
          }
        });
        if (!openpageHasTag) {
          //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
          util.openNewPage(
            this,
            name,
            this.$route.params || {},
            this.$route.query || {}
          );
        }
      },
      handleSubmenuChange(val) {
        // console.log(val)
      },
      beforePush(name) {
        // if (name === 'accesstest_index') {
        //     return false;
        // } else {
        //     return true;
        // }
        return true;
      },
      fullscreenChange(isFullScreen) {
        // console.log(isFullScreen);
      },
      scrollBarResize() {
        if (this.sidebarPage) {
          this.$refs.scrollBar.resize();
        }
      }
    },
    watch: {
      $route(to) {
        this.$store.commit("setCurrentPageName", to.name);
        let pathArr = util.setCurrentPath(this, to.name);
        if (pathArr.length > 2) {
          this.$store.commit("addOpenSubmenu", pathArr[1].name);
        }
        this.checkTag(to.name);
        localStorage.currentPageName = to.name;
      },
      lang() {
        util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
      } /*,
            openedSubmenuArr () {
                setTimeout(() => {
                    this.scrollBarResize();
                }, 300);
            }*/
    },
    mounted() {
      this.init();
      window.addEventListener("resize", this.scrollBarResize);
    },
    created() {
      // 显示打开的页面的列表
      this.$store.commit("setOpenedList");
    },
    dispatch() {
      window.removeEventListener("resize", this.scrollBarResize);
    }
  };
</script>
<style lang="less">
  @import "../styles/main-common.less";
</style>
<style lang="less" scoped>
  .ivu-menu-light {
    height: 64px;
    background-image: linear-gradient(116deg, #2945CB 6%, #2C83F9 100%);
  }

  .layout-logo {
    width: 304px;
    float: left;
    position: relative;
    top: 14px;
    left: 16px;
    img {
      height: 35px;
    }
  }

  .layout-nav {
    text-align: center;
  }

  .ivu-menu-horizontal {
    .ivu-menu-item,
    .ivu-menu-submenu {
      float: none;
      display: inline-block;
    }
    &.ivu-menu-light {
      .ivu-menu-item,
      .ivu-menu-submenu {
        color: rgba(255, 255, 255, 0.8);
      }
      .ivu-menu-item-active,
      .ivu-menu-item:hover,
      .ivu-menu-submenu-active,
      .ivu-menu-submenu:hover {
        color: #fff;
      }
      .ivu-menu-item-active {
        font-weight: bold;
      }
    }
  }

  .top-header {
    .header-avator-con {
      .message-con {
        position: absolute;
        top: 0;
        right: 90px;
        width: 30px;
        /* margin-right: 78px; */
        text-align: center;
        cursor: pointer;
        i {
          vertical-align: middle;
        }
      }
      .user-dropdown-menu-con {
        position: absolute;
        right: 14px;
        top: 0;
        width: 150px;
        /* height: 100%; */
        .main-user-name {
          display: inline-block;
          width: 80px;
          word-break: keep-all;
          white-space: nowrap;
          vertical-align: middle;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: right;
        }
      }
    }
    .search {
      position: absolute;
      right: 130px;
      .ivu-select-dropdown {
        width: 200px;
        margin-top: -10px;
        overflow: initial;
        .ivu-dropdown-item {
          text-align: left;
          .icon:before {
            color: rgba(23, 35, 61, 0.55) !important;
          }
        }
        &:after {
          right: 51px !important;
        }
      }
    }
    .ivu-btn-primary {
      background: transparent;
      border: none;
    }
  }

  .main-search {
    padding-top: 14px;
    .ivu-input-icon-normal+.ivu-input {
      padding-right: 7px;
      padding-left: 32px;
    }
    .ivu-input-icon {
      right: initial;
      left: 0;
    }
  }

  .modal {
    .label {
      line-height: 34px;
      font-size: 14px;
      color: rgba(29, 36, 54, 0.8);
      font-weight: bold;
      text-align: center;
    }
    .check_a {
      display: inline-block;
      height: 34px;
      line-height: 34px;
      padding: 0 5px;
      border-radius: 3px;
      border: 1px solid #dddee1;
      margin-right: 6px;
      margin-bottom: 5px;
      font-size: 14px;
      text-align: center;
      color: rgba(23, 35, 61, 0.8);
      vertical-align: middle;
      cursor: pointer;
      &.checked {
        border-color: #008cf8;
        color: #008cf8;
      }
      &_icon {
        padding-right: 6px;
        font-size: 20px;
      }
    }
  }

  .icon,
  .iconmoon {
    margin-right: 14px;
    font-size: 14px;
    color: rgba(23, 35, 61, 0.55);
  }

  .iconmoon {
    margin-left: -2px;
  }
</style>
<style lang="less">
  .top-header {
    .ivu-icon-android-person:before {
      color: #2b81f7;
      font-size: 17px;
    }
    .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active, .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover, .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-active, .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover {
      border-bottom: none;
    }
  }

  .ivu-select-dropdown {
    width: 200px;
    margin-top: -3px;
    overflow: initial;
    &:after {
      content: "";
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      border-color: transparent;
      border-style: solid;
      top: -5px;
      right: 43px;
      border-width: 0 5px 5px;
      border-bottom-color: #fff;
    }
  }

  .search_dropdown .ivu-select-dropdown:after {
    right: 16px;
  }
</style>