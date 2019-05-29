<!-- 运维管理-产品库管理 -->
<template>
  <div class="manage-right appUser">
    <div class="top-bar clearfix">
      日常维护
    </div>
    <div class="manage-content">
      <div class="content">
        <h3>设备异常          
        </h3>
        <div v-if="Object.keys(tableData.rows).length!=0">
          <table class="mytable">
            <thead>
              <tr>
                <th width="12.5%">设备编号</th>
                <th width="12.5%">异常类型</th>
                <th width="22%">设备地址</th>
                <th width="12.5%">责任人</th>
                <th width="12.5%">联系电话</th>
                <th width="20%">异常时间</th>
                <th width="8%">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in tableData.rows" :key="index">
                <td>{{item.device_id}}</td>
                <td>{{item.warninfo_type}}</td>
                <td>{{item.device_inst_addr}}{{item.city}}</td>
                <td>{{item.device_linkman}}</td>
                <td>{{item.device_telcode}}</td>
                <td>{{item.warninfo_addtime}}</td>
                <td>
                  <a href="javascript:void(0)" @click="warnProcess(item)" v-if="!item.warninfo_bproc">处理</a>
                  <span v-else>已处理</span>
                </td>
              </tr>
            </tbody>
          </table>
          <Modal v-model="modalDetail" title="设备异常详情" class="modal">
              <Row class="mtb15">
                  <Col class="label" span="5">用户帐号
                  </Col>
                  <Col span="19"> {{detailItem.account}}
                  </Col>
              </Row>
              <Row class="mtb15">
                  <Col class="label" span="5">反馈时间
                  </Col>
                  <Col span="19"> {{detailItem.create_time}}
                  </Col>
              </Row>
              <Row class="mtb15">
                  <Col class="label" span="5">反馈内容
                  </Col>
                  <Col span="19"> {{detailItem.device_detail}}
                  </Col>
              </Row>
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
  import echarts from "echarts";
  export default {
    name: "deviceAbnormal",
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
        productModel: "",
        productModelList: {},
        searchId: "",
        productCondition: "",
        productConditionList: [],
        modalDetail: false,
        detailItem: {},
      };
    },
    beforeCreate() {
      // 传值给父级main.vue（第二个导航）
      this.$emit("set-manage-menu", "deviceAbnormal");
    },
    mounted() {
      this.mockTableData();
    },
    methods: {
      mockTableData() {
        const that = this;
        let data = {
          pageno: this.pageObj1.current,
          pagesize: this.pageObj1.size,
        };
        this.axios.post(this.api.getWarnLog, {
          data
        }).then(res => {
          console.log(res, '用户列表数据');
          if (res.result === "true") {
            const resData = res.content;
            that.pageObj1.total = res.recordcount || 0;
            that.tableData.allChecked = false;
            that.tableData.rows = resData || [];
          }
        }).catch(err => {
          console.log(err);
        });
      },
      warnProcess(item) {
          const that = this;
          //异常处理
          this.axios.post(this.api.warnProcess, {
            data:{
              warninfo_id:item.warninfo_id,
            }
          }).then(res => {
            console.log(res);
            if (res.result == "true") {
              this.mockTableData();
              that.$Message.success('处理成功！');
            }
          }).catch(err => {
            console.log(err);
          });
      },
      //查看详情并把未读设为已读
      detail(item) {
          this.modalDetail = true;
          Object.assign(this.detailItem,item);
      },
      resetPw() {
        const that = this;
        const resetPwItem = [];
        this.tableData.rows.forEach(val => {
          if (!!val.checked) {
            resetPwItem.push(val.client_id);
          }
        });
        console.log(resetPwItem);
        if (!resetPwItem.length) {
          this.$Message.error("请选择要密码复位的用户");
          return;
        }
        this.axios.post(this.api.resetPw, {
          data: {
            clientList: JSON.stringify(resetPwItem)
          }
        }).then(res => {
          console.log(res, '密码复位');
          if (res.result == '1') {
            that.mockTableData();
            that.$Message.success('密码复位成功!');
            that.modalAddPush = false;
          } else {
            that.$Message.error(res.msg);
            that.changeLoading();
          }
        }).catch(err => {
          console.log(err);
        })

      },
      changePage(cur) {
        this.pageObj1.current = cur;
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        this.mockTableData();
      },
      trigggerMockTableData() {
        this.pageObj1.current = 1;
        this.mockTableData();
      },
      check(item) {
        //   console.log(this.tableData.allChecked);
        //   let vm = this;
        //   let selectedData = vm.tableData.filter(val => {
        //     return val.checked == true;
        //   });
        //   if (selectedData.length == vm.tableData.length) {
        //     vm.tableData.allChecked = true;
        //   } else {
        //     vm.tableData.allChecked = false;
        //   }
        // 这里用vue的方法哈，当然用JQ的也是可以的（上面的filter要针对数组去用哈，vm.tableData 依然是个对象）
        const tableData = this.tableData;
        // every 就是如果里面的循环，每个都满足条件，就返回true，而只要有一个不满足，就返回false。正好给全选用
        const isAllChecked = tableData.rows.every(val => {
          return val.checked === true;
        });
        tableData.allChecked = isAllChecked;
      },
      checkAll() {
        // 这里用this就好，不用vm来代替，没关系的
        console.log(this.tableData.allChecked);
        let vm = this;
        vm.tableData.rows.forEach(val => {
          val.checked = vm.tableData.allChecked;
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .appUser {
    .fr {
      float: right;
    }
    .content {
      background: #ffffff;
      box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
      border-radius: 2px;
      .feedbackSelect {
        float: right;
        .selected {
          color: #2d8cf0;
        }
      }
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
            text-align: left;
          }
          &:first-child {
            padding-left: 24px;
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
            text-align: left;
          }
          &:first-child {
            padding-left: 24px;
          }
        }
      }
      h3 {
        padding: 16px 24px;
        border-bottom: 1px solid rgba(23, 35, 61, 0.1);
        font-weight: normal;
        font-size: 16px;
        color: #17233d;
      }
      h4 {
        padding: 20px 24px;
        font-size: 14px;
        color: rgba(28, 36, 56, 0.8);
        font-weight: normal;
      }
      .posR {
        position: relative;
      }
    }
  }
</style>