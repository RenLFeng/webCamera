<!-- 运维管理-产品库管理 -->
<template>
    <div class="manage-right appUser">
      <div class="top-bar clearfix">
        系统设置
      </div>
      <div class="manage-content">
        <div class="content">
          <h3>设备类型
              <Button type="primary" class="fr" @click="add()">添加</Button><Input class="search fr" v-model="searchId" placeholder="请输入设备类型名称..." icon="ios-search" @on-change="trigggerMockTableData" style="width: 160px;margin-right:10px;"></Input>
          </h3>
          <div v-if="Object.keys(tableData.rows).length!=0">
            <table class="mytable">
              <thead>
                <tr>
                  <th width="10%">类型id</th>
                  <th width="18%">类型名称</th>
                  <th width="14%">商家</th>
                  <th width="6%">图像质量</th>
                  <th width="16%">通信服务器地址、端口</th>
                  <th width="16%">图片服务器地址、端口</th>
                  <th width="12%">识别接口</th>
                  <th width="8%">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in tableData.rows" :key="index">
                  <td>{{item.devicetype_id}}</td>
                  <td>{{item.devicetype_name}}</td>
                  <td>{{item.agent_name}}</td>
                  <td>{{item.devicetype_quality}}</td>
                  <td>{{item.devicetype_svrip}}:{{item.devicetype_svrport}}</td>
                  <td>{{item.devicetype_imgsvrip}}:{{item.devicetype_imgsvrport}}</td>
                  <td>{{item.aiport_name}}</td>
                  <td>
                    <a href="javascript:void(0)" @click="deleteDevicetype(item)">删除</a><a href="javascript:void(0)" @click="detail(item)" style="margin-left:10px;">编辑</a>
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
          <Modal v-model="modalDetail" title="设备类型编辑|添加" class="modal" @on-ok="editOk">
            <div class="flex mtb15 alignc">
                <Col class="label" span="5">类型名称
                </Col>
                <Col span="19">
                  <Input v-model="detailItem.devicetype_name" placeholder="请输入..." size="large" :maxlength=16></Input>
                </Col>
            </div>
            <div class="flex mtb15 alignc">
                <Col class="label" span="5">工厂ID
                </Col>
                <Col span="19">
                  <!-- <Input v-model="detailItem.agent_id" placeholder="请输入..." size="large" :maxlength=16></Input> -->
                  <Select v-model="detailItem.agent_id" size="large" placeholder="请选择...">
                    <Option v-for="item in agentList" :value="item.agent_id" :key="item.value">{{ item.agent_name }}</Option>
                  </Select>
                </Col>
            </div>
            <div class="flex mtb15 alignc">
                <Col class="label" span="5">图像质量
                </Col>
                <Col span="19">
                  <Input v-model="detailItem.devicetype_quality" placeholder="请输入..." size="large" :maxlength=16></Input>
                </Col>
            </div>
            <div class="flex mtb15 alignc">
                <Col class="label" span="5">通信服务器地址
                </Col>
                <Col span="19">
                  <Input v-model="detailItem.devicetype_svrip" placeholder="请输入..." size="large" :maxlength=16></Input>
                </Col>
            </div>
            <div class="flex mtb15 alignc">
                <Col class="label" span="5">通信服务器端口
                </Col>
                <Col span="19">
                  <Input v-model="detailItem.devicetype_svrport" placeholder="请输入..." size="large" :maxlength=16></Input>
                </Col>
            </div>
            <div class="flex mtb15 alignc">
                <Col class="label" span="5">图片服务器地址
                </Col>
                <Col span="19">
                  <Input v-model="detailItem.devicetype_imgsvrip" placeholder="请输入..." size="large" :maxlength=16></Input>
                </Col>
            </div>
            <div class="flex mtb15 alignc">
                <Col class="label" span="5">图片服务器端口
                </Col>
                <Col span="19">
                  <Input v-model="detailItem.devicetype_imgsvrport" placeholder="请输入..." size="large" :maxlength=16></Input>
                </Col>
            </div>
            <div class="flex mtb15 alignc">
                <Col class="label" span="5">识别接口id
                </Col>
                <Col span="19">
                  <!-- <Input v-model="detailItem.aiport_id" placeholder="请输入..." size="large" :maxlength=16></Input> -->                  
                  <Select v-model="detailItem.aiport_id" size="large" placeholder="请选择...">
                    <Option v-for="item in aiportList" :value="item.aiport_id" :key="item.aiport_id">{{ item.aiport_name }}</Option>
                  </Select>
                </Col>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  </template>
  
  <script>
    import echarts from "echarts";
    export default {
      name: "deviceType",
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
          modalDetail: false,
          detailItem: {
            devicetype_name:"",
            agent_id:"",
            devicetype_quality:"",
            devicetype_svrip:"",
            devicetype_svrport:"",
            devicetype_imgsvrip:"",
            devicetype_imgsvrport:"",
            aiport_id:"",
          },
          agentList:[],
          aiportList:[],
        };
      },
      beforeCreate() {
        // 传值给父级main.vue（第二个导航）
        this.$emit("set-manage-menu", "deviceType");
      },
      mounted() {
        this.getAgentList();
        this.getAiportList();
        this.mockTableData();
      },
      methods: {
        getAgentList() {
          const that = this;
          this.axios.post(this.api.getFactoryList, {
            data:{
              pageno: 1,
              pagesize: 100,
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
        getAiportList() {
          const that = this;
          //获取AI接口选择下拉框列表
          this.axios.post(this.api.getAiportList, {
            data:{
              pageno: 1,
              pagesize: 100,
            }
          }).then(res => {
          console.log(res);
          if (res.result == "true") {
              const resData = res.content;
              that.aiportList = resData || [];
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
            data.devicetype_name = this.searchId;
          }
          this.axios.post(this.api.getDevicetypeList, {
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
            devicetype_name:"",
            agent_id:"",
            devicetype_quality:"",
            devicetype_svrip:"",
            devicetype_svrport:"",
            devicetype_imgsvrip:"",
            devicetype_imgsvrport:"",
            aiport_id:"",
          };
          this.modalDetail = true;
        },
        //查看详情并把未读设为已读
        detail(item) {
            this.modalDetail = true;
            Object.assign(this.detailItem,item);
        },
        deleteDevicetype(item){
          const that=this;
          this.$Modal.confirm({
            title: '删除设备类型',
            content: '<p>是否确认删除该设备类型？</p>',
            onOk: () => {
                this.axios.post(this.api.deleteDevicetype, {
                    data: {
                      devicetype_id: item.devicetype_id,
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
                this.$Message.info('已取消删除该设备类型');
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
          if(this.detailItem.devicetype_id){
            url=this.api.editDevicetype;
          }else{
            url=this.api.addDevicetype;
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
        }
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