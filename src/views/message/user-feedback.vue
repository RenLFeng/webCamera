<!-- 消息中心-通知消息 -->
<template>
  <div class="user-feedback">
    <div class="box">
      <div class="box-hd">用户反馈</div>
      <div class="box-bd">
        <div v-if="Object.keys(tableData.rows).length!=0">
          <table class="mytable">
            <thead>
              <tr>
                <th width="10%">DPID</th>
                <th width="15%">时间</th>
                <th width="20%">用户帐号</th>
                <th width="35%">标题</th>
                <th width="20%">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in tableData.rows" :key="index">
                <td>{{pageObj1.size*(pageObj1.current-1)+index+1}}</td>
                <td>
                  <b class="dot" v-if="item.isread===0"></b>{{item.createdate}}</td>
                <td>{{item.account}}</td>
                <td>{{item.title}}</td>
                <td>
                  <a href="javascript:void(0)" @click="detail(item)">详情</a>
                </td>
              </tr>
            </tbody>
          </table>
          <Modal v-model="modalDetail" title="用户反馈" class="msg_modal" width="640">
            <div class="title">
              <h3>
                {{detailItem.title}}
              </h3>
              <span class="time">{{detailItem.createdate}}</span>
            </div>
            <div slot="footer" class="msg_detail">
              {{detailItem.content}}
            </div>
          </Modal>
          <div class="page_container">
            <Page :current="pageObj1.current" :total="pageObj1.total" :page-size="pageObj1.size" class="page" @on-change="changePage"></Page>
          </div>
        </div>
        <div v-else>
          <p class="empty">
            暂无数据
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "userFeedback",
    data() {
      return {
        developerID: window.localStorage.getItem('developerID'),
        pageObj1: {
          total: 0,
          current: 1,
          size: 10
        },
        tableData: {
          allChecked: false,
          rows: []
        },
        modalDetail: false,
        detailItem: {},
      }
    },
    beforeCreate() {
      // 传值给父级message.vue（选中用户反馈）
      this.$emit("set-message-menu", "user-feedback");
      // 传值给父级message.vue（显示菜单）
      this.$emit("no-menu", false);
    },
    created() {
      this.mockTableData();
    },
    methods: {
      changePage(cur) {
        this.pageObj1.current = cur;
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        this.mockTableData();
      },
      //查看详情并把未读设为已读
      detail(item) {
        let that = this;
        this.modalDetail = true;
        Object.assign(this.detailItem,item);
        if (item.isread != 1) {
          this.axios.post(this.api.editf, {
            data: {
              feedbackID: item.feedback_id,
              /* developerID: that.developerID, */
              isread: 1,
            }
          }).then(res => {
            if (res.result == '1') {
              console.log(res);
              this.mockTableData();
            }
          }).catch(res => {
            console.log(res);
          });
        }
      },
      mockTableData() {
        /* 从接口读取查询反馈信息 */
        const that = this;
        let data = {
          current: this.pageObj1.current,
          size: this.pageObj1.size,
          devID: this.developerID,
        };
        console.log(this.fromTo);
        this.axios.get(this.api.findfb, {
          data
        }).then(res => {
          console.log(res, '查询反馈信息');
          if (res.result == '1') {
            const resData = res.data;
            that.pageObj1.total = resData.total || 0;
            that.tableData.rows = resData.records;
          }
        }).catch(err => {
          console.log(err);
        })
      },

    }
  };
</script>
<style lang="less" scoped>
  .user-feedback {
    .mytable {
      width: 100%;
      th {
        padding: 12px 2px;
        background: rgba(20, 35, 63, 0.04);
        font-size: 12px;
        color: #17233d;
        text-align: left;
        &:first-child,
        &:last-child {
          text-align: center;
        }
      }
      td {
        padding: 5px 2px;
        font-size: 14px;
        color: rgba(28, 36, 56, 0.8);
        &.feedbackCon {
          display: inline-block;
          width: 98%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
        &:first-child,
        &:last-child {
          text-align: center;
        }
        .dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 5px;
          vertical-align: middle;
          background: #008CF8;
        }
      }
    }
  }

  .msg_modal {
    h3 {
      font-size: 14px;
      color: rgba(23, 35, 61, 0.80);
      letter-spacing: 0;
      text-align: left;
      line-height: 1.5;
      font-family: PingFangSC-Medium;
    }
    .time {
      font-size: 12px;
      color: rgba(23, 35, 61, 0.55);
      text-align: left;
      line-height: 20px;
    }
    .msg_detail {
      padding-top: 18px;
      padding-bottom: 40px;
      font-size: 13px;
      color: rgba(11, 17, -2147483648, 0.75);
      text-align: left;
      line-height: 24px;
    }
  }
</style>