import Vue from 'vue';
import iView from 'iview';
import iviewArea from 'iview-area';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import util from './libs/util';
import methods from './libs/methods';
import ajaxApi from './libs/ajax-api'; // 加载接口api，方便统一管理
import ajaxAxios from './libs/ajax-axios'; // 简单封装下axios（其实不封装也可以的）
import axios from 'axios'; // 初始axios
//引入视频插件
import VideoPlay from 'vue-video-player';
require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');
Vue.use(VideoPlay);

Vue.prototype.api = ajaxApi; // 把ajaxApi这个模块绑在Vue的原型上，然后全局环境里 this.api 就能拿到里面的数据了
Vue.prototype.axios = ajaxAxios; // 同理，挂载vue原型上
Vue.prototype.$axios = axios; // 挂载初始axios，以备复杂的请求用这个

Vue.use(VueI18n);
Vue.use(iView);
Vue.use(methods);
Vue.use(iviewArea);

//test
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
        // iview-admin检查更新
        //util.checkUpdate(this);
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
