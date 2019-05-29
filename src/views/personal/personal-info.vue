<!-- 个人中心-基本信息 -->
<template>
  <div class="personal-info">
    <div class="box pd25" style="height:auto;">
      <div class="box-hd">账户信息</div>
      <div class="box-bd">
        <div class="info">
          <div class="label">用户帐号</div>
          <div class="detail">{{personalInfo.account}}</div>
        </div>
        <div class="info">
          <div class="label">账户密码</div>
          <div class="detail">＊＊＊＊＊＊
            <span class="txt_btn" @click="ModalEditPwd = true">修改</span>
            <Modal width="520" v-model="ModalEditPwd" class="modal changepwd_modal" title="修改密码" @on-ok="changePwd('changePwdForm')"
              :loading="loading">
              <Form ref="changePwdForm" :model="form" :rules="rules" :label-width="94">
                <FormItem label="旧密码" prop="oldpassword">
                  <Input type="password" v-model="form.oldpassword" placeholder="请输入原密码...">
                  </Input>
                </FormItem>
                <FormItem label="新密码" prop="password">
                  <Input type="password" v-model="form.password" placeholder="请输入6-32位新密码...">
                  </Input>
                </FormItem>
                <FormItem label="确认新密码" prop="passwdCheck">
                  <Input type="password" v-model.trim="form.passwdCheck" placeholder="重复新密码..."></Input>
                </FormItem>
              </Form>
            </Modal>
          </div>
        </div>
        <div class="info">
          <div class="label">注册时间</div>
          <div class="detail">{{personalInfo.createTime}}</div>
        </div>
        <div class="info">
          <div class="label">同步帐号</div>
          <div class="detail">
            <span class="accout" v-for="item in personalInfo.linkedAccounts">{{item}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="box pd25" style="height:auto;">
      <div class="box-hd">企业信息
        <Button class="save" type="primary" @click="save('formEnterprise')">保存</Button>
      </div>
      <div class="box-bd">
        <Form ref="formEnterprise" :model="formEnterprise" :rules="enterpriseValidate" :label-width="88" label-position="left" class="form_enterprise">
          <FormItem label="企业名称" prop="firmName">
            <Input v-model="formEnterprise.firmName" placeholder="请输入企业名称..." class="input"></Input>
          </FormItem>
          <FormItem label="所属行业" prop="tradeId">
            <Select v-model="formEnterprise.tradeId" placeholder="请选择贵公司所属行业" class="input">
              <Option v-for="(item,index) in industryList" :value="item.tradeID" :key="index">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="所在地区" prop="provinceCity">
            <al-cascader v-model="formEnterprise.provinceCity" data-type="name" level="1" placeholder="所在地区" class="input province_city"/>
          </FormItem>
          <FormItem label="公司地址" prop="address">
            <Input v-model="formEnterprise.address" placeholder="请输入公司地址..." class="input"></Input>
          </FormItem>
          <FormItem label="联系人" prop="contactName">
            <Input v-model="formEnterprise.contactName" placeholder="请输入联系人..." class="input"></Input>
          </FormItem>
          <FormItem label="联系电话" prop="tel">
            <Input v-model="formEnterprise.tel" placeholder="请输入联系电话…" class="input"></Input>
          </FormItem>
          <FormItem label="联系邮箱" prop="mail">
            <Input v-model="formEnterprise.mail" placeholder="请输入联系邮箱…" class="input"></Input>
          </FormItem>
          <FormItem label="需求备注" prop="note">
            <Input v-model="formEnterprise.note" type="textarea" placeholder="需求备注…" class="input_l"></Input>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
  const md5 = require("js-md5");
  export default {
    name: "personalInfo",
    data() {
      const validatePassCheck = (rule, value, callback) => {
        if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      return {
        developerID: window.localStorage.getItem('developerID'),
        companyId:"",
        personalInfo: {
          account: "",
          company: "",
          linkedAccounts: [],
          createTime: ""
        },
        ModalEditPwd: false,
        loading: false,
        form: {
          oldpassword: "",
          password: "",
          passwdCheck: "",
        },
        industryList: [],
        formEnterprise: {
          firmName: '',
          tradeId: null,
          address: '',
          provinceCity:[],
          contactName: '',
          tel: '',
          mail: '',
          note: '',
        },
        rules: {
          oldpassword: [
            { required: true, trigger: "blur", message: "密码不能为空" },
            { type: 'string', trigger: 'blur', min: 6, max: 16, message: '密码最少6位数，最多16位数' }
          ],
          password: [
            { required: true, trigger: "blur", message: "密码不能为空" },
            { type: 'string', trigger: 'blur', min: 6, max: 16, message: '密码最少6位数，最多16位数' }
          ],
          passwdCheck: [
            { required: true, trigger: "blur", message: "重复密码不能为空" },
            { type: 'string', trigger: 'blur', min: 6, max: 16, message: '密码最少6位数，最多16位数' },
            { validator: validatePassCheck, trigger: 'blur' }
          ]
        },
        enterpriseValidate: {
          firmName: [{
            required: true,
            message: '企业名称不能为空',
            trigger: 'blur'
          }],
          tradeId: [
            { required: true, message: '请选择贵公司所属行业', trigger: 'change', type: 'string' }
          ],
          address: [{
            type: 'string',
            required: true,
            message: '公司地址不能为空',
            trigger: 'blur'
          }],
          provinceCity:[{
            type: 'array',
            required: true,
            message: '公司地址不能为空',
            trigger: 'blur'
          }],
          contactName: [{
            required: true,
            message: '联系人不能为空',
            trigger: 'blur'
          }],
          tel: [{
            required: true,
            message: '联系电话不能为空',
            trigger: 'blur'
          },
          {
            validator: this.validPhone,
            message: '请正确填写联系电话',
            trigger: 'blur'
          }],
          mail: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
          ],
          note: [{
            trigger: 'blur'
          }],
        },
      }
    },
    beforeCreate() {
      // 传值给父级personal.vue（选中基本信息）
      this.$emit("set-personal-menu", "personal-info");
    },
    created() {
      this.getPersonalInfo();
      this.getIndustryList();
    },
    methods: {
      changePwd(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            //  通过校验之后，拿所需参数去读修改密码接口
            const form = this.form;
            this.axios.post(this.api.modifyPwd, {
              data: {     // !!!这些字段看后台给的修改checkCode
                oldPwd: md5(form.oldpassword),
                newPwd: md5(form.password),
              },
              /* showError: true,
              errorText: '修改失败，请重试' */
            }).then(res => {
              if (res.result === '1') {
                this.$Message.success('修改成功！');
                this.ModalEditPwd = false;
              } else {
                this.$Message.error(res.msg);
                return this.changeLoading();
              }
            }).catch(err => {
              console.log(err);
            });
          } else {
            return this.changeLoading();
          }
        })
      },
      getPersonalInfo() {
        const that = this;
        this.axios.get(this.api.devInfo, {}).then(res => {
          console.log(res, '获取开发者信息');
          if (res.result == '1') {
            const resData = res.data;
            Object.assign(that.personalInfo, resData);
            if (resData.company) {
              let arr=[];
              arr.push(resData.company.province||"");
              arr.push(resData.company.city||"");
              that.formEnterprise.firmName = resData.company.name;
              that.formEnterprise.tradeId = resData.company.tradeId;
              that.formEnterprise.address = resData.company.address;
              that.formEnterprise.provinceCity = arr;
              that.formEnterprise.contactName = resData.company.contact;
              that.formEnterprise.tel = resData.company.telephone;
              that.formEnterprise.mail = resData.company.email;
              that.formEnterprise.note = resData.company.description;
              that.companyId=resData.company.id;
            }
          }
        }).catch(err => {
          console.log(err);
        });
      },
      getIndustryList() {
        this.axios.get(this.api.industryList).then(res => {
          this.industryList = res;
        });
      },
      save(name) {
        const that = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            //  通过校验之后，拿所需参数去读修改密码接口
            const form = that.formEnterprise;
            this.axios.post(that.api.companySave, {
              data: {     // !!!这些字段看后台给的修改checkCode
                userId: that.developerID,
                id:that.companyId,
                name: form.firmName,
                tradeId: form.tradeId,
                address: form.address,
                province:form.provinceCity[0],
                city:form.provinceCity[1],
                contact: form.contactName,
                telephone: form.tel,
                email: form.mail,
                description: form.note,
              },
              /* showError: true,
              errorText: '修改失败，请重试' */
            }).then(res => {
              console.log(res, '修改公司信息');
              if (res.result === '1') {
                that.getPersonalInfo();
                that.$Message.success('修改成功！');
              } else {
                that.$Message.error(res.msg);
              }
            }).catch(err => {
              console.log(err);
            });
          } else {
          }
        })
      },
    },
  };
</script>
<style lang="less" scoped>
  .personal-info {
    .info {
      padding: 12px 0 12px 86px;
      &:last-child {
        padding-bottom: 36px;
      }
      .label,
      .detail {
        display: inline-block;
        font-size: 14px;
      }
      .label {
        margin-left: -86px;
        width: 56px;
        margin-right: 32px;
        color: rgba(23, 35, 61, 0.55);
      }
      .detail {
        font-size: 14px;
        color: rgba(23, 35, 61, 0.80);
        .txt_btn {
          margin-left: 5px;
          font-size: 14px;
          color: #008CF8;
          cursor: pointer;
        }
      }
      .accout {
        position: relative;
        padding-right: 34px;
        &:after {
          content: "";
          position: absolute;
          right: 17px;
          top: 3px;
          height: 12px;
          width: 1px;
          background: rgba(23, 35, 61, 0.10);
        }
        &:last-child:after {
          display: none;
        }
      }
    }
    .form_enterprise {
      padding-top: 15px;
      padding-bottom: 15px;
      .input {
        width: 332px;
        background: rgba(23, 35, 61, 0.06);
        border-radius: 2px;
      }
      .input_l {
        width: 448px;
        border-radius: 2px;
        background: rgba(23, 35, 61, 0.06);
      }
    }
    .save {
      margin-top: 10px;
      width: 80px;
      float: right;
    }
  }
</style>
<style lang="less">
  .changepwd_modal {
    .ivu-form .ivu-form-item-label {
      font-size: 14px;
      color: rgba(29, 36, 54, 0.80);
      font-weight: bold;
    }
    .ivu-form-item-required .ivu-form-item-label:before {
      display: none;
    }
  }

  .personal-info {
    .ivu-form .ivu-form-item-label {
      font-size: 14px;
      color: rgba(23, 35, 61, 0.55);
    }
    .ivu-form-item-required .ivu-form-item-label:before {
      display: none;
    }
  }
  .ivu-cascader-transfer{
    width:auto;
  }
</style>