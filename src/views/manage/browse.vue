<!-- 运维管理-产品库管理 -->
<template>
    <div class="manage-right appUser">
      <div class="top-bar clearfix">
        运维管理
      </div>
      <div class="manage-content">
        <div class="content">
          <h3>用户管理
            <Button type="primary" class="fr" @click="add()">添加</Button>                   
            <Select class="fr" v-model="user_sex" style="width: 160px;margin-right:10px;" placeholder="选择性别..." @on-change="trigggerMockTableData">
              <Option value="">全部</Option>
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
            <Input class="search fr" v-model="searchId" placeholder="请输入用户姓名..." icon="ios-search" @on-change="trigggerMockTableData" style="width: 160px;margin-right:10px;"></Input>
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
                  <th width="16%">头像</th>
                  <th width="17%">姓名</th>
                  <th width="8%">性别</th>
                  <th width="18%">证件号码</th>
                  <th width="23%">添加时间</th>
                  <th width="8%">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in tableData.rows" :key="index">
                  <td>{{item.user_id}}</td>
                  <td><img :src="api.baseURL+item.user_foto_url" alt="" class="img_p100"></td>
                  <td>{{item.user_name}}</td>
                  <td>{{item.user_sex}}</td>
                  <td>{{item.user_idcard}}</td>
                  <td>{{item.user_addtime}}</td>
                  <td>
                    <a href="javascript:void(0)" @click="deleteUser(item)">删除</a><a href="javascript:void(0)" @click="detail(item)" style="margin-left:10px;">编辑</a>
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
          <Modal v-model="modalDetail" title="用户编辑|添加" class="modal" @on-ok="editOk">
            <div class="flex mtb15 alignc">
                <Col class="label" span="5">用户名称
                </Col>
                <Col span="19">
                  <Input v-model="detailItem.user_name" placeholder="请输入..." size="large" :maxlength=16></Input>
                </Col>
            </div>
            <div class="flex mtb15 alignc">
                <Col class="label" span="5">性别
                </Col>
                <Col span="19">                      
                  <Select v-model="detailItem.user_sex" size="large" placeholder="请选择...">
                    <Option value="男">男</Option>
                    <Option value="女">女</Option>
                  </Select>
                </Col>
            </div>
            <div class="flex mtb15 alignc">
                <Col class="label" span="5">年龄
                </Col>
                <Col span="19">
                  <Input v-model="detailItem.user_age" placeholder="请输入..." size="large" :maxlength=16></Input>
                </Col>
            </div>
            <div class="flex mtb15 alignc">
                <Col class="label" span="5">身份证号
                </Col>
                <Col span="19">
                  <Input v-model="detailItem.user_idcard" placeholder="请输入..." size="large" :maxlength=32></Input>
                </Col>
            </div>
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
                <Col class="label" span="5">电话号码
                </Col>
                <Col span="19">
                  <Input v-model="detailItem.user_telcode" placeholder="请输入..." size="large" :maxlength=16></Input>
                </Col>
            </div>
            <div class="flex mtb15 alignc">
                <Col class="label" span="5">用户照片内容
                </Col>
                <Col span="19">     
                  <img :src="src" alt="" class="img_320">             
                  <label class="select-file"  for="file">
                    <i class="iconfont icon-tianjiatupian"></i> &nbsp;{{detailItem.user_foto_content?'换图片':'选择图片'}}
                    <input type="file" name="file" accept=".jpg" hidden id="file" value="" @change="loadPic($event)" />
                  </label>
                  <!-- <Input v-model="detailItem.user_foto_content" placeholder="请输入..." size="large" :maxlength=16></Input> -->
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
      name: "browse",
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
          productModel: "",
          productModelList: {},
          searchId: "",
          user_sex:'',
          modalDetail: false,
          detailItem: {},
          src:'',
          agentList:[],
        };
      },
      beforeCreate() {
        // 传值给父级main.vue（第二个导航）
        this.$emit("set-manage-menu", "browse");
      },
      mounted() {
        this.getAgentList();
        this.mockTableData();
      },
      methods: {
        getAgentList() {
          const that = this;
          let agent_isfactory='false';
          //获取客户选择下拉框列表
          if(window.localStorage.getItem('developerID')==='2'){
            agent_isfactory='true';
          }
          let data={
            agent_name:'',
            pageno: 1,
            pagesize: 100,
            agent_isfactory,
          };
          if (this.agent_id) {
            data.agent_id = this.agent_id;
          }
          this.axios.post(this.api.getAgentList, {
            data
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
            data.agent_name = this.searchId;
          }
          if (this.user_sex) {
            data.user_sex = this.user_sex;
          }
          if (this.agent_id) {
            data.agent_id = this.agent_id;
          }
          this.axios.post(this.api.getUserList, {
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
            user_name:"",
            user_sex:"男",
            user_age:"",
            user_idcard:"",
            agent_id:"",
            user_telcode:"",
            user_foto_content:"",
          };
          this.src=this.detailItem.user_foto_content;
          this.modalDetail = true;
        },
        //查看详情并把未读设为已读
        detail(item) {
            this.modalDetail = true;
            Object.assign(this.detailItem,item);
            this.src=this.api.baseURL+item.user_foto_url;
        },
        deleteUser(item){
          const that=this;
          this.$Modal.confirm({
            title: '删除用户',
            content: '<p>是否确认删除该用户？</p>',
            onOk: () => {
                this.axios.post(this.api.deleteUser, {
                    data: {
                      user_id: item.user_id,
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
                this.$Message.info('已取消删除该用户');
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
          if(this.detailItem.user_id){
            url=this.api.editUser;
          }else{
            url=this.api.addUser;
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
        loadPic(event){ //浏览LOGO
          // this.detailItem.user_foto_content = window.URL.createObjectURL(event.target.files[0]);
          let reader = new FileReader();  //新建一个FileReader对象
          const that=this;
          reader.readAsDataURL(event.target.files[0]);  //将读取的文件转换成base64格式
          reader.onload = function(event) {
              console.log(event.target.result)    //转换后的文件数据存储在e.target.result中
              that.detailItem.user_foto_content=event.target.result.replace(/data:[\s\S]*?(?:base64,)/,'');
              that.src=event.target.result;
              console.log('ye');
          }
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
              display: block-block;
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
    .img_p100{
      max-width:90%;
      max-height:50px;
      vertical-align: middle;
    }
    .img_320{
      max-width:320px;
      max-height:320px;
    }
    .select-file{
      width:60px;
      height:60px;
      display: block;
      border:1px dashed #60a5e8;
      color:#60a5e8;
      line-height: 60px;
      text-align:center;;
    }
    .label{
      padding-left:20px;
    }
  </style>