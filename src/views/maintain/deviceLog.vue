<!-- 运维管理-产品库管理 -->
<template>
  <div class="manage-right manage-products">
    <div class="top-bar">
      日常维护
    </div>      
    <div class="manage-content">
      <div class="content">
        <h3>设备日志
        </h3>
        <div v-if="Object.keys(tableData).length!=0">
          <table class="mytable">
            <thead>
              <tr>
                <th width="50%">DPID</th>
                <th width="30%">连接方式</th>
                <th width="10%">故障率</th>
                <th width="10%">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in tableData" :key="index">
                <td>
                    <p class="first pb10"><span class="jiankong"></span><b class="bold">ID:{{item.img_id}}</b></p>
                    <p class="first flex"><span class="left">设备编号:{{item.device_id}}</span><span class="right">性别:{{item.img_sex}}</span></p>
                    <p class="first flex"><span class="left">上报时间:{{item.img_datetime}}</span><span class="right">年龄:{{item.img_age}}</span></p>
                </td>
                <td><img :src="!item.img_url?url:api.baseURL+item.img_url" alt=""></td>
                <td>
                    <p class="pb10">&nbsp;</p>
                    <p>状态</p>
                    <p>{{item.img_correct==='false'?'未修正':'已修正'}}</p>
                </td>
                <td>
                  <p class="pb10">&nbsp;</p>
                  <p v-if="item.img_correct==='false'">
                    <span class="txt_btn" @click="correctRecogn(item)">修正</span>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- <Page :total="100" :page-size="10" :current="1" @on-change="changePage" class="page"></Page> -->
          <div class="page_container">
            <Page :current="pageObj1.current" :total="pageObj1.total" :page-size="pageObj1.size" class="page" @on-change="changePage"></Page>
          </div>
        </div>
        <div v-else>
          <p class="empty">
            暂无数据
          </p>
        </div>        
        <Modal v-model="modalDetail" title="修正" class="modal" @on-ok="editOk" style="width:180px;">
          <div class="flex mtb15 alignc">
              <div class="flex alignc col_12">
                <Col class="label" span="5">性别
                </Col>
                <Col span="19">                      
                  <Select v-model="detailItem.img_sex" size="large" style="width:150px;" placeholder="请选择...">
                    <Option value="男">男</Option>
                    <Option value="女">女</Option>
                  </Select>
                </Col>
              </div>
              <div class="flex alignc col_12">
                <Col class="label" span="5">年龄
                </Col>
                <Col span="19">
                  <InputNumber v-model="detailItem.img_age" placeholder="请输入..." size="large" :min=0 :max=110 style="width:150px;"></InputNumber >
                </Col>
              </div>
          </div>
        </Modal>
      </div>
    </div>
  </div>
</template>

<script>
  const md5 = require("js-md5");
  export default {
    name: "deviceLog",
    data() {
      return {
        token: window.localStorage.getItem("token"),
        loading: true,
        ModalAddProduct: false,
        tableData: [],
        selected: false,
        pageObj1: {
          total: 0,
          current: 1,
          size: 10
        },
        url: require("../../images/product.png"),
        excelUrl: "/static/productExcel.xlsx",
        productType: '',
        productTypeList: [],
        ModalProductExcel: false,
        formExecl: {
          file: {
            name: ''
          }
        },
        rulesExcel: {
          /* file: [{
            required: true,
            message: '文档不能为空',
            trigger: 'blur'
          }] */
        },
        cutDown: {
          time: 60,
          hasSend: false
        },
        syncAccounts: [],
        ModalProductSync: false,
        editSyncAccount: false,
        formSync: {
          phone: '',
          vcode: '',
          password: ''
        },
        rulesSync: {
          phone: [{ required: true, trigger: "blur", validator: this.validPhone }],
          vcode: [{ required: true, trigger: "blur", message: "请获取验证码" }],
          password: [
            { required: true, trigger: "blur", message: "密码不能为空" },
            { type: 'string', trigger: 'blur', min: 6, max: 16, message: '密码最少6位数，最多16位数' }
          ],
        },
        url:require('../../images/product.png'),
        detailItem:{},
        modalDetail:false,
      }
    },
    watch: {
      syncAccounts: function (val) {
        if (val.length < 1) {
          this.editSyncAccount = true;
        }
      }
    },
    beforeCreate() {
      // 传值给父级main.vue（第二个导航）
      this.$emit("set-manage-menu", "deviceLog");
    },
    created() {
      this.mockTableData();
    },
    computed: {
      productsSelected: {
        get: function () {
          var that = this;
          if (!!that.productType) {
            return this.productTypeList.filter(item => {
              return item.id == that.productType;
            })[0].ptlist;
          }
        }
      },
      productSelectedNum: {
        get: function () {
          let selectedItem = [];
          this.productTypeList.filter(item => {
            item.ptlist.filter(val => {
              if (val.checked) {
                selectedItem.push(val);
              }
            })
          });
          return selectedItem.length;
        }
      }
    },
    methods: {
      ok() {
        this.$Message.success("保存成功");
      },
      cancel() {
        this.$Message.info("已取消");
      },
      //返回产品图片地址
      imgUrl(imgId) {
        return imgId ? (this.api.imgUrl + imgId) : require('../../images/product.png');
      },
      mockTableData() {
        /* let data = [];
        for (let i = 0; i < 10; i++) {
          data.push({
            dipid: "00" + (i + 1),
            industry: "智能喷头",
            productName: "智慧农业",
            productId: "23476ffsdfg",
            quantity: parseInt(Math.floor(Math.random() * 10000)),
            createTime: "2018.2.11 18:11",
            version: "V1.2",
            connectionType: "蓝牙",
            failureRate: "12%"
          });
        }
        this.tableData = data; */
        //实际数据
        const that = this;
        this.axios.post(this.api.getDeviceLog, {
          data: {
            pageno: this.pageObj1.current,
            pagesize: this.pageObj1.size,
          },
        }).then(res => {
          console.log(res);
          if (res.result === "true") {
            const resData = res.content;
            that.pageObj1.total = res.recordcount || 0;
            that.tableData = resData;
          }
        }).catch(err => {
          console.log(err);
        });
      },
      changePage(cur) {
        this.pageObj1.current = cur;
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        this.mockTableData();
      },
      toggleProductType(item) {
        this.productType = item.id;
      },
      correctRecogn(item) {
        const that = this;
        Object.assign(this.detailItem,item);
        this.detailItem.img_age=Number(item.img_age);
        this.modalDetail=true;
      },
      editOk() {
        const that = this;
        this.axios.post(this.api.correctRecogn, {
          data: {
            img_id: this.detailItem.img_id,
            sex:this.detailItem.img_sex,
            age:this.detailItem.img_age.toString(),
          }
        }).then(res => {
          console.log(res, 'post correctRecogn');
          if (res.result === 'true') {
            that.$Message.success('已修正');
            that.modalDetail=false;
            that.mockTableData();
          }else{            
            that.$Message.error(res.message);
          }
        }).catch(err => {
          console.log(err);
        })
      },
    }
  };
</script>
<style lang="less">
  .manage-products {
    .fr {
      float: right;
      .txt_btn {
        display: inline-block;
        margin-right: 5px;
        vertical-align: middle;
        font-size: 14px;
        color: #008CF8;
        cursor: pointer;
      }
    }
    .ghost-blue {
      margin-left: 5px;
    }
    .content {
      background: #FFFFFF;
      box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
      border-radius: 2px;
      .feedbackSelect {
        float: right;
        .selected {
          color: #2D8CF0;
        }
      }
      .mytable {
        width: 100%;
        th {
            height:0;
            padding: 0px 2px;
            background: rgba(20, 35, 63, 0.04);
            border:none;
            font-size: 0;
            color: #17233D;
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
            vertical-align: top;
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
            text-align: left;
          }
          &:first-child {
            padding-left: 24px;
          }
          img{
              max-height:80px;
              max-width:90%;
              vertical-align: middle;
          }
          .txt_btn {
            font-size: 14px;
            color: #008CF8;
            cursor: pointer;
          }    
          p{
            &.first{
              padding-left: 35px;   
            }
            &.pb10{
              padding-bottom: 10px;
            }
            .jiankong{
                display: inline-block;
                width:30px;
                height:30px;
                background:url(../../images/jiankong.jpg) center center no-repeat;
                background-size:100%;
                margin-left: -30px;
                margin-right: 5px;
                vertical-align: top;
            }
          }     
          .flex{
              .left{
                  width:70%;
                  padding-left: 23px;
              }
              .right{
                  width:30%;
              }
          }
        }
      }
      h3 {
        padding: 16px 24px;
        border-bottom: 1px solid rgba(23, 35, 61, 0.10);
        font-weight: normal;
        font-size: 16px;
        color: #17233D;
      }
      h4 {
        padding: 20px 24px;
        font-size: 14px;
        color: rgba(28, 36, 56, 0.80);
        font-weight: normal;
      }
      .posR {
        position: relative;
      }
    }
  }
  .modal{
    .col_12{
      width:50%;
    }
  }
</style>