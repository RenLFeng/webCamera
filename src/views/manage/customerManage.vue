<!-- 运维管理-产品库管理 -->
<template>
    <div class="manage-right appUser">
      <div class="top-bar clearfix">
        运维管理
      </div>
      <div class="manage-content">
        <div class="content">
          <h3>客户管理
              <Button type="primary" class="fr" @click="add()">添加</Button><Input class="search fr" v-model="searchId" placeholder="请输入客户名称..." icon="ios-search" @on-change="trigggerMockTableData" style="width: 160px;margin-right:10px;"></Input>
          </h3>
          <div v-if="Object.keys(tableData.rows).length!=0">
            <table class="mytable">
              <thead>
                <tr>
                  <th width="10%">编号</th>
                  <th width="20%">客户名称</th>
                  <th width="11%">联系电话</th>
                  <th width="10%">联系人</th>
                  <th width="15%">联系邮箱</th>
                  <th width="16%">添加时间</th>
                  <th width="10%">是否工厂</th>
                  <th width="8%">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in tableData.rows" :key="index">
                  <td>{{item.agent_id}}</td>
                  <td>{{item.agent_name}}</td>
                  <td>{{item.agent_telcode}}</td>
                  <td>{{item.agent_linkman}}</td>
                  <td>{{item.agent_weixin}}</td>
                  <td>{{item.agent_addtime}}</td>
                  <td>{{item.agent_isfactory}}</td>
                  <td>
                    <a href="javascript:void(0)" @click="deleteAgent(item)">删除</a><a href="javascript:void(0)" @click="detail(item)" style="margin-left:10px;">编辑</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <Modal v-model="modalDetail" title="客户编辑|添加" class="modal" @on-ok="editOk">
                <div class="flex mtb15 alignc">
                    <Col class="label" span="5">客户名称
                    </Col>
                    <Col span="19">
                      <Input v-model="detailItem.agent_name" placeholder="请输入..." size="large" :maxlength=32></Input>
                    </Col>
                </div>
                <div class="flex mtb15 alignc">
                    <Col class="label" span="5">联系人
                    </Col>
                    <Col span="19">
                      <Input v-model="detailItem.agent_linkman" placeholder="请输入..." size="large" :maxlength=16></Input>
                    </Col>
                </div>
                <div class="flex mtb15 alignc">
                    <Col class="label" span="5">电话
                    </Col>
                    <Col span="19">
                      <Input v-model="detailItem.agent_telcode" placeholder="请输入..." size="large" :maxlength=16></Input>
                    </Col>
                </div>
                <div class="flex mtb15 alignc">
                    <Col class="label" span="5">微信
                    </Col>
                    <Col span="19">
                      <Input v-model="detailItem.agent_weixin" placeholder="请输入..." size="large" :maxlength=32></Input>
                    </Col>
                </div>
                <div class="flex mtb15 alignc">
                    <Col class="label" span="5">地址
                    </Col>
                    <Col span="19">
                      <Input v-model="detailItem.agent_addr" placeholder="请输入..." size="large" :maxlength=32></Input>
                    </Col>
                </div>
                <div class="flex mtb15 alignc">
                    <Col class="label" span="5">是否工厂
                    </Col>
                    <Col span="19">                      
                      <Select v-model="detailItem.agent_isfactory" size="large" placeholder="请选择...">
                        <Option value="true">是</Option>
                        <Option value="false">否</Option>
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
      name: "customerManage",
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
          detailItem: {},
        };
      },
      beforeCreate() {
        // 传值给父级main.vue（第二个导航）
        this.$emit("set-manage-menu", "customerManage");
      },
      mounted() {
        this.mockTableData();
      },
      methods: {
        mockTableData() {
          const that = this;
          let agent_isfactory='false';
          //获取客户选择下拉框列表
          if(window.localStorage.getItem('developerID')==='2'){
            agent_isfactory='true';
          }
          let data = {
            pageno: this.pageObj1.current,
            pagesize: this.pageObj1.size,
            agent_isfactory,
          };
          if (this.searchId) {
            data.agent_name = this.searchId;
          }
          this.axios.post(this.api.getAgentList, {
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
          agent_name:"",
          agent_linkman:"",
          agent_telcode:"",
          agent_weixin:"",
          agent_addr:"",
          agent_isfactory:"false",
        };
        this.modalDetail = true;
      },
        //查看详情并把未读设为已读
        detail(item) {
            this.modalDetail = true;
            Object.assign(this.detailItem,item);
        },
        deleteAgent(item){
          const that=this;
          this.$Modal.confirm({
            title: '删除商家',
            content: '<p>是否确认删除该商家？</p>',
            onOk: () => {
                this.axios.post(this.api.deleteAgent, {
                    data: {
                      agent_id: item.agent_id,
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
                this.$Message.info('已取消删除该商家');
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
          if(this.detailItem.agent_id){
            url=this.api.editAgent;
          }else{
            url=this.api.addAgent;
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