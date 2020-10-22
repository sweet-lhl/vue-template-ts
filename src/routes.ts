import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
    {
        path:'/',
        name: 'main',
        component: () => import(/* webpackChunkName: "main-view" */ './views/Main.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
                // meta: { title: '首页' },
            },
        ],
    }
];

export default routes;
