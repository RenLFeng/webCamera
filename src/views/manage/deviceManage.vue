<!-- 运维管理-产品库管理 -->
<template>
  <div class="manage-right appUser">
    <div class="top-bar clearfix">
      运维管理
    </div>
    <div class="manage-content">
      <div class="content">
        <h3>设备管理
            <Button type="primary" class="fr" @click="add()">添加</Button>
            <Input class="search fr" v-model="searchId" placeholder="请输入设备安装地址..." icon="ios-search" @on-change="trigggerMockTableData" style="width: 160px;margin-right:10px;"></Input>
            <Input class="search fr" v-model="searchDeviceId" placeholder="请输入设备ID..." icon="ios-search" @on-change="trigggerMockTableData" style="width: 160px;margin-right:10px;"></Input>
            <DatePicker class="fr" type="datetimerange" format="yyyy/MM/dd" placement="bottom-end" placeholder="选择时间范围" style="width: 210px;margin-right:10px;" :value="fromTo" @on-change="isDaterange3($event)"></DatePicker>
            <Select class="fr" v-model="agent_id" style="width: 160px;margin-right:10px;" placeholder="选择所属客户..." @on-change="trigggerMockTableData">
              <Option value="">全部</Option>
              <Option v-for="item in agentList" :value="item.agent_id" :key="item.value">{{ item.agent_name }}</Option>
            </Select>
        </h3>
        <div v-if="Object.keys(tableData.rows).length!=0">
          <table class="mytable">
            <thead>
              <tr>
                <th width="10%">编号</th>
                <th width="10%">设备类型</th>
                <th width="26%">安装地址</th>
                <th width="12%">责任人</th>
                <th width="12%">联系电话</th>
                <th width="22%">添加时间</th>
                <th width="8%">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in tableData.rows" :key="index">
                <td>{{item.device_id}}</td>
                <td>{{item.device_type}}</td>
                <td>{{item.device_addr}}</td>
                <td>{{item.device_linkman}}</td>
                <td>{{item.device_telcode}}</td>
                <td>{{item.device_time}}</td>
                <td>
                  <a href="javascript:void(0)" @click="deleteDevice(item)">删除</a><a href="javascript:void(0)" @click="detail(item)" style="margin-left:10px;">编辑</a>
                </td>
              </tr>
            </tbody>
          </table>
          <Modal v-model="modalDetail" title="设备编辑|添加" class="modal" @on-ok="editOk">
              <div class="flex mtb15 alignc">
                  <Col class="label" span="5">商家id
                  </Col>
                  <Col span="19">
                    <!-- <Input v-model="detailItem.agent_id" placeholder="请输入..." size="large" :maxlength=16></Input> -->
                    <Select v-model="detailItem.agent_id" size="large" placeholder="请输入...">
                      <Option v-for="item in agentList" :value="item.agent_id" :key="item.value">{{ item.agent_name }}</Option>
                    </Select>
                  </Col>
              </div>
              <div class="flex mtb15 alignc">
                  <Col class="label" span="5">设备类型id
                  </Col>
                  <Col span="19">
                    <!-- <Input v-model="detailItem.devicetype_id" placeholder="请输入..." size="large" :maxlength=16></Input> -->
                    <Select v-model="detailItem.devicetype_id" size="large" placeholder="请输入...">
                      <Option v-for="item in devicetypeList" :value="item.devicetype_id" :key="item.devicetype_id">{{ item.devicetype_name }}</Option>
                    </Select>
                  </Col>
              </div>
              <div class="flex mtb15 alignc">
                  <Col class="label" span="5">设备mac
                  </Col>
                  <Col span="19">
                    <Input v-model="detailItem.device_mac" placeholder="请输入..." size="large" :maxlength=16></Input>
                  </Col>
              </div>
              <div class="flex mtb15 alignc">
                  <Col class="label" span="5">设备安装地址
                  </Col>
                  <Col span="19">
                    <Input v-model="detailItem.device_addr" placeholder="请输入..." size="large" :maxlength=32></Input>
                  </Col>
              </div>
              <div class="flex mtb15 alignc">
                  <Col class="label" span="5">设备安装时间
                  </Col>
                  <Col span="19">
                    <DatePicker type="datetime" format="yyyy/MM/dd HH:mm:ss" placement="bottom-end" placeholder="请选择..." style="width: 280px" :value="detailItem.device_time" @on-change="isDaterange($event)"></DatePicker>
                  </Col>
              </div>
              <div class="flex mtb15 alignc">
                  <Col class="label" span="5">设备联系人
                  </Col>
                  <Col span="19">
                    <Input v-model="detailItem.device_linkman" placeholder="请输入..." size="large" :maxlength=16></Input>
                  </Col>
              </div>
              <div class="flex mtb15 alignc">
                  <Col class="label" span="5">联系电话
                  </Col>
                  <Col span="19">
                    <Input v-model="detailItem.device_telcode" placeholder="请输入..." size="large" :maxlength=16></Input>
                  </Col>
              </div>
              <div class="flex mtb15 alignc">
                  <Col class="label" span="5">有效期
                  </Col>
                  <Col span="19">
                    <DatePicker type="datetime" format="yyyy/MM/dd HH:mm:ss" placement="bottom-end" placeholder="请选择..." style="width: 280px" :value="detailItem.device_validperiod" @on-change="isDaterange2($event)"></DatePicker>
                  </Col>
              </div>
              <div class="flex mtb15 alignc">
                  <Col class="label" span="5">是否启用
                  </Col>
                  <Col span="19">
                    <Select v-model="detailItem.device_isused" style="width:160px" placeholder="请选择...">
                      <Option value="false">否</Option>
                      <Option value="true">是</Option>
                    </Select>
                  </Col>
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
  import echarts from "echarts";
  export default {
    name: "deviceManage",
    data() {
      return {
        developerID: window.localStorage.getItem('developerID'),
        agent_id: window.localStorage.getItem('agent_id'),
        pageObj1: {
          total: 0,
          current: 1,
          size: 10
        },
        tableData: {
          allChecked: false,
          rows: []
        },
        searchId: "",
        searchDeviceId:'',
        fromTo: ['', ''],
        productCondition: "",
        productConditionList: [],
        modalDetail: false,
        detailItem: {
          // device_time:'',
          // device_validperiod:''
        },
        agentList:[],
        devicetypeList:[],
      };
    },
    beforeCreate() {
      // 传值给父级main.vue（第二个导航）
      this.$emit("set-manage-menu", "deviceManage");
    },
    mounted() {
      this.getDevicetypeList();
      this.getAgentList();
      this.mockTableData();
    },
    methods: {
      getDevicetypeList() {
        const that = this;
        //获取设备类型选择下拉框列表
        this.axios.post(this.api.getDevicetypeList, {
          data:{
            agent_name:'',
            pageno: 1,
            pagesize: 100,
          }
        }).then(res => {
          console.log(res);
          if (res.result === "true") {
            const resData = res.content;
            that.devicetypeList = resData || [];
          }
        }).catch(err => {
          console.log(err);
        });
      },
      getAgentList() {
        const that = this;
        let agent_isfactory='false';
        //获取客户选择下拉框列表
        if(window.localStorage.getItem('developerID')==='2'){
          agent_isfactory='true';
        }
        this.axios.post(this.api.getAgentList, {
          data:{
            agent_name:'',
            pageno: 1,
            pagesize: 100,
            agent_isfactory,
          }
        }).then(res => {
        console.log(res);
        if (res.result == "true") {
            const resData = res.content;
            that.agentList = resData || [];
        }
        }).catch(err => {
          console.log(err);
        });
      },
      mockTableData() {
        const that = this;
        let data = {
          pageno: this.pageObj1.current,
          pagesize: this.pageObj1.size,
        };
        if (this.searchId) {
          data.device_addr = this.searchId;
        }
        if (this.searchDeviceId) {
          data.device_id = this.searchDeviceId;
        }
        if (this.agent_id) {
          data.agent_id = this.agent_id;
        }
        if(this.fromTo[0]){
          data.begintime=this.fromTo[0];
          data.endtime=this.fromTo[1];
        }
        this.axios.post(this.api.getDeviceList, {
          data
        }).then(res => {
          console.log(res);
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
      //添加
      add(){
          this.detailItem={
            agent_id:"",
            devicetype_id:"",
            device_mac:"",
            device_addr:"",
            device_time:"",
            device_linkman:"",
            device_telcode:"",
            device_validperiod:"",
            device_isused:"true",
          };
        this.modalDetail = true;
      },
      //查看详情并把未读设为已读
      detail(item) {
          this.modalDetail = true;
          Object.assign(this.detailItem,item);
      },
      deleteDevice(item){
        const that=this;
        this.$Modal.confirm({
          title: '删除设备',
          content: '<p>是否确认删除该设备？</p>',
          onOk: () => {
              this.axios.post(this.api.deleteDevice, {
                  data: {
                    agent_id: item.agent_id,
                    device_id:item.device_id
                  }
              }).then(res => {
                  console.log(res);
                  if (res.result === 'true') {
                      that.mockTableData();
                      that.$Message.success('删除成功!');
                      that.modalAddPush = false;
                  } else {
                      that.$Message.error(res.msg);
                      that.changeLoading();
                  }
              }).catch(err => {
                  console.log(err);
              })
          },
          onCancel: () => {
              this.$Message.info('已取消删除该设备');
          }
        });
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
      },
      //编辑、添加的确认
      editOk(){
        const that=this;
        let url='',data={};
        if(this.detailItem.device_id){
          url=this.api.editDevice;
        }else{
          url=this.api.addDevice;
        }
        Object.assign(data,this.detailItem);
        this.axios.post(url, {
            data
        }).then(res => {
            console.log(res);
            if (res.result === 'true') {
                that.mockTableData();
                that.$Message.success('保存成功!');
                that.modalAddPush = false;
            } else {
                that.$Message.error(res.msg);
                that.changeLoading();
            }
        }).catch(err => {
            console.log(err);
        })
      },      
      isDaterange(e) {
          this.detailItem.device_time = e;
      }, 
      isDaterange2(e) {
          this.detailItem.device_validperiod = e;
      },
      isDaterange3(e) {
          this.fromTo = e;
          this.trigggerMockTableData();
      },
    }
  };
</script>
<style lang="less" scoped>
  .appUser {
    .fr {
      float: right;
    }
    .mr10{
      margin-right: 10px;
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