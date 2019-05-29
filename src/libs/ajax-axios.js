/* axios简单做下处理 */
import {
  router
} from '../router/index';
import {
  Message
} from 'iview';
import axios from 'axios';
import qs from 'qs';


// 设置初始参数 ****************
const http = axios.create({
  baseURL: 'http://127.0.0.1:8088', // 这里是放接口的统一前缀
  timeout: 10000 // 请求多少秒后还请求不到的话，就放弃,  
});


// 使用原型链+promise方式，重新封装一个axios实例 *****************
const vueAjax = function () {
  // 预先初始化axios的必备参数
  this.params = {};
};

// 原型函数：转换参数
vueAjax.prototype.setParams = function (type, api, params) {
  // 把参数赋给初始函数的属性
  this.params = params || {};
  // 然后处理一下http必要的type、url和data三个参数
  const thisParams = this.params;
  thisParams.axiosParam = {};
  thisParams.axiosParam.method = type === 'post' ? 'post' : 'get';
  // thisParams.axiosParam.url = api;
  //注释掉在头部加token，变成在链接里加token
  const token=window.localStorage.getItem('token')||'';
  if(!token){    
    if(api!=='/face_pic_svr/login'){
      window.localStorage.clear();
      //Message.error('登录失效，请重新登录！');
      router.replace('/login');
    }else{
      thisParams.axiosParam.url=api;
    }
  }else{    
    thisParams.axiosParam.url=api;
    thisParams.data=thisParams.data||{};
    thisParams.data.token=token;
    // thisParams.axiosParam.url=api+'?token='+token;
    // 暂时不加access_token
    // thisParams.axiosParam.url=api;
    // if(api!=='/face_pic_svr/login'){
      // thisParams.axiosParam.token=window.localStorage.getItem('token');
    // }
  }
  /* thisParams.axiosParam.headers={
    Authorization: ('Bearer '+window.localStorage.getItem('token')) || ''  // 这是token
  }; */
  if (thisParams.data) {
    let dataName = type === 'post' ? 'data' : 'params';
    thisParams.axiosParam[dataName] = (type === 'post' ? JSON.stringify(thisParams.data) : thisParams.data);
  }
  if (thisParams.showError) {
    Object.assign(thisParams, {
      showError: !!params.showError,
      errorText: thisParams.errorText || '数据获取失败'
    });
  }
};

// 原型函数：用promise实现异步返回数据
vueAjax.prototype.promiseAjax = function (type, api, params, resolve, reject) {
  // 先转换一下参数
  this.setParams(type, api, params);
  const thisParams = this.params;  
  // 然后开始请求
  http(thisParams.axiosParam).then(res => {
    const resData = res.data;
    // 如果有定义显示错误的参数，且后台返回不是1，就弹窗报错
    if (thisParams.showError && resData && resData.result && resData.result !== 'true') {
      Message.error(thisParams.errorText);
    }
    if(resData.errorcode==='EC002'){
      window.localStorage.clear();
      // Message.error('登录失效，请重新登录！');
      router.replace('/login');
    }
    resolve(resData);
  }).catch(err => {
    // 如果存在response，则是服务器错误
    const response = err.response;
    if (err.response) {
      // 401 是没登录或者登陆失效
      if (response.status === 401) {
        window.localStorage.clear();
        Message.error('登录失效，请重新登录！');
        router.replace('/login');
      } else if (thisParams.showError) {
        Message.error((thisParams.errorText || '网络请求错误') + '：' + err.response.status);
      }
      reject('网络请求错误：' + err.response.status);
    } else if (err.message === 'Network Error') {
      // 跨域或者其他网络错误
      if (thisParams.showError) {
        Message.error((thisParams.errorText || '网络请求错误') + '：500');
      }
      reject('网络请求错误：500');
    } else {
      // ajax-axios这里面js代码出错了
      reject(err.message);
    }

  });
};

// 原型函数：模拟get方法
vueAjax.prototype.get = function (api, params) {
  const getx = (resolve, reject) => {
    this.promiseAjax('get', api, params, resolve, reject);
  };
  return new Promise(getx);
};

// 原型函数：模拟get方法
vueAjax.prototype.post = function (api, params) {
  const postx = (resolve, reject) => {
    this.promiseAjax('post', api, params, resolve, reject);
  };
  return new Promise(postx);
};


// 返回一个新的原型链函数实例，供mian.js调用 *****************
export default new vueAjax();

/*


// axios封装好的写法如下 -----------------------
// 1. 不用管token了，已经封装进去了
// 2. 不管是get还是post，都是这种写法了
// 3. 里面第一个参数是api，第二个参数如果有，就写，没有就不要写。是个对象
// 4. 参数对象包含data、showError和errorText.
// 5. data是给后台的参数；showError=true就代表报错会弹窗显示，为false或者不写就是不弹窗；errorText是错误提示的蚊子，不写会默认用“网络请求错误:500”
this.axios.get(this.api.getMni, {
    data: {
      name: 1,
      id: 2
    },
    showError: true,
    errorText: '错误提示'
  }).then(res => {
    // res现在直接是后台的数据，不用res.data去取了，你可以打印看看
  })
  .catch(err => {
    // 报错这里可写可不写。 这个err是报错类型，你可以故意搞错打印看看
    // 上面的 {} 参数里有 showError 字段的话，会自动打印错误，这里就可以不用写了
    // 但你也可以不写 showError 字段，而在这里面自己写错误逻辑
  });


  */