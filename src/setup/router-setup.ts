import Vue from 'vue';
import Router, { NavigationGuardNext, Route, RouteConfig } from 'vue-router'; /// doc: https://router.vuejs.org/api
import url from 'url';
import cookies from 'cookies-js';


// @ts-ignore
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import i18n, { setI18nLanguage } from './i18n-setup';
import routes from '../routes'
import VueI18n from "vue-i18n";

Vue.use(Router);

NProgress.configure({showSpinner: false}) // NProgress Configuration

type _Position = { x: number; y: number };

type _RouteMethod = {
    [key in keyof Route]: any
};

const TITLE: string = window.document.title; // 获取初始window窗口的标题
const locales: string[] = i18n?.availableLocales.map((_locale: VueI18n.Locale) => _locale.toLowerCase()) || []; // 项目支持的语言包[小写]
const router: Router = new Router({
    mode: 'history',
    base: url.parse(process.env.BASE_URL || '').path ?? undefined, // 适用于OSS/CDN，process.env.BASE_URL仅适用于开发部署
    routes: routes.map((_route: RouteConfig): RouteConfig => ({
        ..._route,
        alias: locales.map((_locale: string): string => `/${_locale + _route.path}`), // 添加国际化URL前缀
    })),
    scrollBehavior(to: Route, from: Route, savedPosition: void | _Position): void | _Position {
        return savedPosition || { x: 0, y: 0 };
    },
});

const routerNext = { // router进入页面前执行的事件
    setLanguage({ meta }: any): Promise<boolean> { // 语言设置
        const {
            // @ts-ignore
            lang = locales.find(_locale => new RegExp(`^/${_locale}`, 'im').test(router.history.pending.path)) /* 路径设置语言 */ || i18n.locale,
        }: {
            lang: string
        } = meta;

        if (lang) setI18nLanguage(lang);
        return Promise.resolve(true);
    },
    setTitle({ meta }: any): Promise<boolean> { // 窗口标题设置
        const { title }: {
            title: string | Function
        } = meta;
        window.document.title = (typeof title === 'function' ? title() : title) || TITLE; // 动态修改窗口标题
        return Promise.resolve(true);
    },
    setRequiresAuth({ meta }: any): Promise<boolean | string> { // 路由鉴权
        NProgress.start()
        const { requiresAuth }: { requiresAuth: boolean } = meta;
        if (requiresAuth) return Promise.resolve(cookies.get('token') || '/login');
        return Promise.resolve(true);
    },
    setRedirect({ meta }: any): Promise<boolean> { // 动态路由重定向
        const { redirection } = meta;
        // eslint-disable-next-line prefer-rest-params
        if (redirection) return Promise.resolve(typeof redirection === 'function' ? redirection.apply(router, arguments) : redirection);
        return Promise.resolve(true);
    },
};

router.beforeEach((to: Route, from: Route, next: NavigationGuardNext<Vue>): Promise<void> => Promise.all(
    Object.values(routerNext).map((func: Function): Promise<boolean | string> => func(to, from)),
).then((response:(string | boolean)[]): void => {
    const path = [...response].reverse()/* 遵循webpack-loader加载与解析顺序规则 */.find((_path: string | boolean) => _path && typeof _path === 'string') as string;
    switch (true) {
        case Boolean(path):
            return next({ path, replace: true });
        case response.some(isNext => !isNext):
            return next(false);
        default:
            return next();
    }
}).catch((error: any): void => next(error)).finally(NProgress.done()));

router.afterEach((/* to: Route, from: Route */): void => { // 自定义元素滚动到顶部
    NProgress.done()
    const el: HTMLElement | null = document.getElementById('app');
    if (el) el.scrollTop = <number>0;
});

// @ts-ignore
export const route: _RouteMethod = <keyof Route>[
    'params',
    'query',
    'path',
    'name',
    'meta',
    'matched',
    'hash',
    'fullPath'
].reduce<_RouteMethod>(// @ts-ignore
    (acc: {[key: string | number]: any }, cur: string): string => Object.defineProperty(acc, cur, { get: (): any => router.history.current[cur] }) || acc,
    Object.create(null),
);

export default router;
