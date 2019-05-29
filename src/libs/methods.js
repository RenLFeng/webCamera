/* 自定义封装的方法，全局用 */

export default {
  install: function (Vue, options) {

    // rem自适应适配设置
    Vue.prototype.setAutoSize = function () {
      var deviceWidth = document.documentElement.clientWidth;
      if (deviceWidth > 640) {
        deviceWidth = 640;
      };
      document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
    };

    // 时间格式化
    Vue.prototype.dateFormat = function (dateNum, format) {
      var isDate = dateNum,
        result = '';
      if (typeof dateNum === 'string') { //判断格式
        var reg = /\D/g;
        if (!reg.test(dateNum)) { //如果是纯数字的字符串
          isDate = parseInt(dateNum);
        } else { //将-换成/，并且去掉最后的毫秒，以支持IE8-9
          isDate = dateNum.replace(/\-/g, '/').split('.')[0];
        }
      }
      var date = new Date(isDate),
        isFormat = format ? format.toString() : 'YYYY.MM.DD hh:mm:ss', //判断是否存在并转成字符串
        dateObj = { //定义格式
          'YYYY': date.getFullYear(),
          'MM': (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
          'DD': date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
          'hh': date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
          'mm': date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
          'ss': date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        };
      result = isFormat.replace(/(YYYY|MM|DD|hh|mm|ss)/g, function (args) { //匹配转换格式
        return dateObj[args] || args;
      });
      return result; //返回结果
    };

    // 手机号码正则验证
    Vue.prototype.regPhone = function (str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    };

    // 手机号码valid验证
    Vue.prototype.validPhone = function (rule, value, callback) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      if (!value) {
        callback(new Error('请输入手机号码'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的11位手机号码'));
      } else {
        callback();
      }
    };

    //邮箱正则验证
    Vue.prototype.regMail = function (str) { const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/; return reg.test(str); }
    //弹框阻止关闭
    Vue.prototype.changeLoading = function () {
      this.loading = false;
      this.$nextTick(() => {
        this.loading = true;
      });
    };
  }
};