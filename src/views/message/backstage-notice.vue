<!-- 消息中心-后台公告 -->
<template>
  <div class="backstage-notice">
    <div class="box">
      <div class="box-hd">公告列表</div>
      <div class="box-bd">
        <div v-if="Object.keys(tableData.rows).length!=0">
          <table class="mytable">
            <thead>
              <tr>
                <th width="10%">DPID</th>
                <th width="25%">时间</th>
                <th width="45%">标题</th>
                <th width="20%">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in tableData.rows" :key="index">
                <td>{{pageObj1.size*(pageObj1.current-1)+index+1}}</td>
                <td><b class="dot" v-if="item.isread===0"></b>{{item.createdate}}</td>
                <td>{{item.title}}</td>
                <td>
                  <!-- <router-link :to="'/message/notice-detail?id='+item.notice_id" target="_blank">详情</router-link> -->
                  <router-link :to="'/message/notice-detail?id='+item.notice_id">详情</router-link>
                </td>
              </tr>
            </tbody>
          </table>
          <Modal v-model="modalDetail" title="后台公告" class="modal">
            <div class="title"></div>
            <div slot="footer">
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
    name: "backstageNotice",
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
      }
    },
    beforeCreate() {
      // 传值给父级message.vue（选中后台公告）
      this.$emit("set-message-menu", "backstage-notice");
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
      /* //查看详情并把未读设为已读
      detail(item) {
        this.$router.push({
          name: 'noticeDetail',
          params: {
            id: item.info_id
          }
        })
      }, */
      mockTableData() {
        /* 从接口读取根据条件查询查询后台公告 */
        const that = this;
        let data = {
          current: this.pageObj1.current,
          size: this.pageObj1.size,
          devID: this.developerID,
        };
        console.log(this.fromTo);
        this.axios.get(this.api.findnotice, {
          data
        }).then(res => {
          console.log(res, '根据条件查询查询后台公告');
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
  .backstage-notice {
    .mytable {
      width: 100%;
      th {
        padding: 12px 2px;
        background: rgba(20, 35, 63, 0.04);
        font-size: 12px;
        color: #17233D;
        text-align: left;
        &:first-child,
        &:last-child {
          text-align: center;
        }
      }
      td {
        padding: 5px 2px;
        font-size: 14px;
        color: rgba(28, 36, 56, 0.80);
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
</style>