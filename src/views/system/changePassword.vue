<!-- 运维管理-产品库管理 -->
<template>
    <div class="manage-right appUser">
      <div class="top-bar clearfix">
        系统设置
      </div>
      <div class="manage-content">
        <div class="content">
          <h3>密码修改</h3>          
          <div class="editpassword-con">
            <Form ref="loginForm" :model="form" :rules="rules">
                <FormItem prop="oldPassword">
                  <Input type="password" v-model="form.oldPassword" placeholder="请输入原密码" size="large">
                  </Input>
                </FormItem>
              <FormItem prop="password">
                <Input type="password" v-model="form.password" placeholder="请输入5-32位新密码" size="large">
                </Input>
              </FormItem>
              <FormItem prop="passwdCheck">
                <Input type="password" v-model.trim="form.passwdCheck" placeholder="重复新密码5～32位..." size="large"></Input>
              </FormItem>
              <!-- <FormItem prop="code">
                <Button class="btn-code" type="ghost" size="large" :disabled="cutDown.hasSend" @click="getCode">{{ cutDown.hasSend ? ('剩余 '+ cutDown.time + ' s') : '发送验证码' }}</Button>
                <Input class="code" v-model.trim="form.code" placeholder="请输入验证码..." size="large"></Input>
              </FormItem> -->
              <FormItem>
                <Button @click="handleSubmit" type="primary" long size="large">完成</Button>
              </FormItem>
            </Form>
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
    const md5 = require("js-md5");
    export default {
      name: "changePassword",
      data() {
        const validatePassCheck = (rule, value, callback) => {
          if (value !== this.form.password) {
            callback(new Error('两次输入密码不一致'));
          } else {
            callback();
          }
        };
        return {
          cutDown: {
            time: 60,
            hasSend: false
          },
          form: {
            code: "",
            oldPassword: "",
            password: "",
            passwdCheck: "",
          },
          rules: {
            code: [{ required: true, trigger: "blur", message: "请获取验证码" }],
            oldPassword: [
              { required: true, trigger: "blur", message: "密码不能为空" },
              { type: 'string', trigger: 'blur', min: 5, max: 16, message: '密码最少5位数，最多16位数' }
            ],
            password: [
              { required: true, trigger: "blur", message: "密码不能为空" },
              { type: 'string', trigger: 'blur', min: 5, max: 16, message: '密码最少5位数，最多16位数' }
            ],
            passwdCheck: [
              { required: true, trigger: "blur", message: "重复密码不能为空" },
              { type: 'string', trigger: 'blur', min: 5, max: 16, message: '密码最少5位数，最多16位数' },
              { validator: validatePassCheck, trigger: 'blur' }
            ]
          }
        };
      },
      beforeCreate() {
        // 传值给父级main.vue（第二个导航）
        this.$emit("set-manage-menu", "changePassword");
      },
      mounted() {
      },
      methods: {
        // 获取验证码
        getCode() {
          const userName = this.form.userName;
          if (!this.regPhone(userName)) {
            this.$Message.info("请输入正确格式的手机号码");
            return;
          }
          this.axios.get(this.api.getCode + userName, {
          }).then(res => {
            if (res.result === '1') {
              this.cutDown.hasSend = true;
              this.countDownTime();
              this.$Message.success("验证码已发送到您的手机，请注意查收！");
            } else {
              this.$Message.error(res.msg);
            }
          }).catch(err => {
            console.log(err);
          });
        },
        // 倒计时函数
        countDownTime() {
          const cutDown = this.cutDown;
          const fnCount = () => {
            const count = setTimeout(() => {
              if (cutDown.time <= 0) {
                clearTimeout(count);
                cutDown.hasSend = false;
                cutDown.time = 60;
              } else {
                cutDown.time -= 1;
                fnCount();
              }
            }, 1000);
          };
          fnCount();
        },
        // 确定提交按钮
        handleSubmit() {
          const that=this;
          this.$refs.loginForm.validate(valid => {
            if (valid) {
              //  通过校验之后，拿所需参数去读修改密码接口
              const form = this.form;
              this.axios.post(this.api.changPassword, {
                data: {     // !!!这些字段看后台给的修改checkCode
                  operator_account: window.localStorage.getItem('user'),
                  operator_oldpassword: md5(form.oldPassword).substr(8, 16),
                  operator_password: md5(form.password).substr(8, 16),
                }
              }).then(res => {
                if (res.result === 'true') {
                  that.axios.post(that.api.logout,{}).then(res => {
                    console.log(res.result);
                    if (res.result==='true') {
                      window.localStorage.clear();
                      this.$store.commit("logout", this);
                      this.$store.commit("clearOpenedSubmenu");
                      this.$router.push({
                        name: "login"
                      });
                    }else{
                      console.log(res.message);
                    }
                  }).catch(err => {
                    console.log(err);
                  });
                  this.$Message.success('修改成功！');
                } else {
                  this.$Message.error(res.msg);
                }
              }).catch(err => {
                console.log(err);
              });
            }
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
      .mr10{
        margin-right: 10px;
      }
      .content {
        background: #ffffff;
        box-shadow: 0 2px 4px 0 rgba(31, 49, 89, 0.25);
        border-radius: 2px;        
        .editpassword-con{
          width:440px;
          margin:50px auto;
          box-sizing:border-box;
          padding: 40px 40px 20px;
          border:1px solid #ddd;
          border-radius:5px;
          .code {
              width: 215px;
          }
          .btn-code {
              width: 100px;
              padding-left: 0;
              padding-right: 0;
              float: right;
          }
        }
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