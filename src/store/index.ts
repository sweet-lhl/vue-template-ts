/// doc: https://vuex.vuejs.org/api
// import path from 'path';
import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import {State} from './types';
import state from './state';
import mutations from './mutations';

import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

const isDebug: boolean = process.env.NODE_ENV !== 'production';
// @ts-ignore
const modules = require.context('./modules', false, /\.(js|ts)$/);

/* eslint no-shadow: ["error", { "allow": ["state"] }] */
const moduleOptions: StoreOptions<State> = {
    modules: modules.keys()
        .reduce((acc: object, key: string) =>  ({
            ...acc,
            [key.replace(/(\.\/|\.js|\.ts)/g, '')]: modules(key).default,
        }), {}),
    state,
    mutations,
    actions,
    getters,
    strict: !isDebug, // 任何 mutation 处理函数以外修改 Vuex state 都会抛出错误
    // plugins: debug ? [createLogger()] : [],
};
export default new Vuex.Store(moduleOptions);