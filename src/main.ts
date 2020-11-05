/// doc: https://vuejs.org/v2/api
import Vue, {
    CreateElement,
    VNode,
    VueConstructor,
    ComponentOptions,
    WatchHandler,
    WatchOptionsWithHandler
} from 'vue';
import {DefaultData} from "vue/types/options";

// @ts-ignore
import Vant from 'vant';
import 'vant/lib/index.css';

import './assets/styleSheet/global.css';

Vue.use(Vant);

import store from './store';
import router from './setup/router-setup';
import i18n from './setup/i18n-setup';
import App from './App.vue';

import components from './plugins/components';
Vue.use(components);

// Compile with --noImplicitThis
<VueConstructor>new Vue(<ComponentOptions<Vue, DefaultData<Vue>, undefined, undefined, undefined, undefined>>{
    el: '#root',
    router,
    store,
    i18n,
    data () {
        return { isRender: true };
    },
    watch: {
        '$i18n.locale': <WatchOptionsWithHandler<string>>{ // 监听语言变化
            handler: <WatchHandler<string>>function (n: string, o: string) {
                if (n !== o) {
                    this.isRender = false;
                    this.$nextTick(() => { this.isRender = true; });
                }
            },
            deep: true,
            immediate: true,
        },
    },
    // components: { App },
    // template: '<App/>', // https://cli.vuejs.org/config/#runtimecompiler
    render(h: CreateElement): VNode | null {
        return this.$data.isRender ? h(App) : null;
    },
});
