<!-- 个人中心-发布记录 -->
<template>
  <div class="release-records">
    <div class="box">
      <div class="box-hd">发布记录</div>
      <div class="box-bd">
        <div v-if="Object.keys(tableData.rows).length!=0">
          <table class="mytable">
            <thead>
              <tr>
                <th width="10%">DPID</th>
                <th width="25%">产品名称</th>
                <th width="15%">创建时间</th>
                <th width="15%">发布时间</th>
                <th width="15%">发布状态</th>
                <th width="20%">备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in tableData.rows" :key="index">
                <td>{{pageObj1.size*(pageObj1.current-1)+index+1}}</td>
                <td>{{item.ptname}}</td>
                <td>{{item.cdate}}</td>
                <td>{{item.pdate}}</td>
                <td>{{status[item.status-1]}}</td>
                <td>
                  {{item.title?item.title:'－－'}}
                </td>
              </tr>
            </tbody>
          </table>
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
    name: "releaseRecords",
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
        status: ['审核中', '发布成功', '审核不通过'],
      }
    },
    beforeCreate() {
      // 传值给父级personal.vue（选中发布记录）
      this.$emit("set-personal-menu", "release-records");
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
      mockTableData() {
        /* 从接口读取产品发布记录列表 */
        const that = this;
        let data = {
          current: this.pageObj1.current,
          size: this.pageObj1.size,
          devID: this.developerID,
        };
        console.log(this.fromTo);
        this.axios.post(this.api.publishList, {
          data
        }).then(res => {
          console.log(res, '产品发布记录列表');
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
  .release-records {
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