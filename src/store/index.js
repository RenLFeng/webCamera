import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        showError:{
            code:'',
            text:''
        }
    },
    mutations: {
        mtnShowError(sta, val){
            Object.assign(sta.showError, val);
        }
    },
    actions: {

    },
    modules: {
        app,
        user
    }
});

export default store;
