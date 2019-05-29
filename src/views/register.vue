<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con lay-register">
      <div class="login-header">
        <img class="logo" :src="logoScip" />
        <h2> 手机注册 </h2>
      </div>
      <div class="form-con">
        <Form ref="loginForm" :model="form" :rules="rules">
          <FormItem prop="userName">
            <Input v-model.trim="form.userName" placeholder="请输入注册手机号码..." size="large"> </Input>
          </FormItem>
          <FormItem prop="code">
            <Button class="btn-code" type="ghost" size="large" :disabled="cutDown.hasSend" @click="getCode">{{ cutDown.hasSend ? ('剩余 '+ cutDown.time + ' s') : '发送验证码' }}</Button>
            <Input class="code" v-model.trim="form.code" placeholder="请输入验证码..." size="large"></Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model.trim="form.password" placeholder="请输入6-16位密码" size="large"> </Input>
          </FormItem>
          <FormItem prop="agree">
            <Checkbox v-model="form.agree">我已阅读并同意
              <router-link class="a_txt" to="">TalkingData服务协议</router-link>
            </Checkbox>
          </FormItem>
          <FormItem>
            <Button type="primary" long size="large" :disabled="!form.agree" @click="handleSubmit">立即注册</Button>
          </FormItem>
          <p class="login-tip">
            已有账户？
            <router-link to="/login">去登录</router-link>
          </p>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
  const md5 = require("js-md5");
  export default {
    data() {
      return {
        logoImg: require('../images/logo.png'),
        logoScip: require('../images/logo_small.jpg'),
        cutDown: {
          time: 60,
          hasSend: false
        },
        form: {
          userName: "",
          code: "",
          password: "",
          agree: true
        },
        rules: {
          userName: [{ required: true, trigger: "blur", validator: this.validPhone }],
          code: [{ required: true, trigger: "blur", message: "请获取验证码" }],
          password: [
            { required: true, trigger: "blur", message: "密码不能为空" },
            { type: 'string', trigger: 'blur', min: 6, max: 16, message: '密码最少6位数，最多16位数' }
          ]
        }
      };
    },
    created() { },
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
      // 确定注册按钮
      handleSubmit() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            //  通过校验之后，拿所需参数去读注册接口
            const form = this.form;
            this.axios.post(this.api.register, {
              data: {
                account: form.userName,
                password: md5(form.password),
                vcode: form.code // !!!验证码字段看后台给的修改checkCode
              }
            }).then(res => {
              if (res.result === '1') {
                this.$Message.success('注册成功！');
                setTimeout(() => {
                  this.$router.push('/login');
                }, 1000);
              }else{
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
  @import "../styles/login.css";
</style>