<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con lay-login">
      <div class="login-header">
        <img class="logo" :src="logoScip" />
        <h2> 帐号登录 </h2>
      </div>
      <div class="form-con">
        <Form ref="loginForm" :model="form" :rules="rules">
          <FormItem prop="userName">
            <Input v-model="form.userName" placeholder="请输入用户名" size="large"></Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="form.password" placeholder="请输入6-16位密码" size="large"> </Input>
          </FormItem>
          <FormItem>
            <Checkbox v-model="form.remeber">7日内记住我</Checkbox>
            <router-link class="fr a_txt" to="/forgetPwd">忘记了密码？</router-link>
          </FormItem>
          <FormItem>
            <Button @click="handleSubmit" type="primary" long size="large">登录</Button>
          </FormItem>
        </Form>
        <p class="login-tip" v-if="false">还没有账户？
          <router-link to="/register">去注册</router-link>
        </p>
      </div>
    </div>
    <div class="record"><a href="http://www.miitbeian.gov.cn" target="blank">粤ICP备13027483号-3</a></div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
// 引入md5插件 (https://github.com/emn178/js-md5) （数字类型会报错，只能字符串）
const md5 = require("js-md5");
const qs=require("qs");
export default {
  data() {
    return {
      logoImg: require('../images/logo.png'),
      logoScip:require('../images/logo_small.jpg'),
      form: {
        userName: "",
        password: "",
        remeber: false,
      },
      rules: {
        userName: [{ required: true, max: 16, message: '用户名最多16位',trigger: "blur", }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { type: 'string', min: 2, max: 16, message: '密码最少2位数，最多16位数', trigger: 'blur' }
        ]
      }
    };
  },
  mounted(){
    this.$Message.config({
      top: 140,
      duration: 3
  });
  },
  created() {
    // 通过 cookie 设置“记住我”
    const remberUserName = Cookies.get('remberUserName');
    const remberPassword = Cookies.get('remberPassword');
    if (!!remberUserName && !!remberPassword) {
      // 同时存在表示他之前勾选过
      this.form.remeber = true;
      Object.assign(this.form, {
        userName: remberUserName,
        password: remberPassword
      });
    }
  },
  methods: {
    // 点击登录
    handleSubmit() {
      console.log("login");
      const that=this;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 通过校验之后，拿账号和密码去axios登录
          const userName = this.form.userName;
          const simplePassword=this.form.password;
          const password = md5(this.form.password);
          // !!!这里模拟登陆，有接口后这两句删除 ↓
          /* this.setToken(userName, password, '123456');
          return; */
          // !!!这里模拟登陆，有接口后这两句删除  ↑      
          that.axios.post(that.api.login, { 
            data:{
              username:userName,
              password:password.substr(8, 16),
            }
          }).then(res => {
            console.log(res.result);
            if (res.result==='true') {
              that.$Message.success('登陆成功！');
              // 设置是否记住我（这里的cookie和下面登录的不是一样的。登录信息退出后会清空，但是“记住我”这里是7天后才清空）
              that.setRember(userName, password);
              // 设置登录缓存和记住token
              let userType='';
              if(res.operator_issuper==='true'){
                userType='1';
              }else{
                if(res.agent_isfactory==='true'){
                  userType='2';
                }else{
                  userType='3';
                }
              }
              let operator_id=res.operator_id||'',
                  agent_id=res.agent_id||'';
              that.setToken(userName, password, res.token,userType,operator_id,agent_id);
              if(userType==='1'||userType==='3'){
                that.$router.push('/maintain/todayControl');
              }else{
                that.$router.push('/manage');
              }
              // 设置权限？ 
              // if (userName === 'talkdata') {
              //   Cookies.set('access', 0);
              // } else {
              //   Cookies.set('access', 1);
              // }
            }else{
              that.$Message.error(res.message);
              console.log(res.message);
            }
          }).catch(err => {
            that.$Message.error(err.message);
            console.log(err.result);
          });  
        /* //最后试试form提交        
        let formdata = new FormData();        
        formdata.append('grant_type', "password");    
        formdata.append('user_type', "DEVELOPER");    
        formdata.append('username', userName);    
        formdata.append('password', password);
        this.$axios({
          baseURL: this.api.baseURL,
          url: this.api.login,
          method: 'post',        
          data: formdata
        }).then(res => {
          console.log(res.data);
            if (res.data.access_token) {
              // that.$Message.success('登陆成功！');
              // 设置是否记住我（这里的cookie和下面登录的不是一样的。登录信息退出后会清空，但是“记住我”这里是7天后才清空）
              that.setRember(userName, simplePassword);
              // 设置登录缓存和记住token
              that.setToken(userName, simplePassword, res.data.access_token);
              that.userInfo(res.data.access_token);
            }
        }).catch(err => {
          console.log(err);
          this.$Message.error("账号或密码错误");
        }); */
        }
      });
    },
    // 是否记住我的设置
    setRember(userName, password) {
      const isRember = this.form.remeber;
      if (isRember) {
        // 如果勾选，则存储账户名和密码
        Cookies.set('remberUserName', userName, { expires: 7 });
        Cookies.set('remberPassword', password, { expires: 7 });
      } else {
        // 否则清除掉
        Cookies.remove('remberUserName');
        Cookies.remove('remberPassword');
      }
    },
    // 设置账号、密码和token的缓存
    setToken(userName, password, token,userType,operator_id,agent_id) {
      Cookies.set('user', userName);
      Cookies.set('password', password);
      window.localStorage.setItem('user', userName);
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('userType', userType);
      window.localStorage.setItem('operator_id', operator_id);
      window.localStorage.setItem('agent_id', agent_id);
    },
    userInfo(token){
        this.$axios({
          baseURL: this.api.baseURL,
          url: this.api.userInfo+'?access_token='+token,
          method: 'get',  
        }).then(res => {
          console.log(res.data);
          const developerID=res.data.userAuthentication.principal.userId;
          if (developerID) {
            window.localStorage.setItem('developerID', developerID);
            this.$router.push('/maintain');
          }
        }).catch(err => {
          console.log(err);
          this.$Message.error("登录失败");
        });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../styles/login.css";
</style>