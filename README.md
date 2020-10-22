#### Vue-template

```bash
/
├── README.md
├── webpack # webpack相关配置及服务目录
├── node_modules # package包代码存放目录
├── package.json # 项目包描述文件
├── postcss.config.js # postcss配置文件
├── public # 原始静态资源目录(涵盖项目内部的模板文件)
├── src # 主要的工作目录
├── .eslintrc.json # eslintrc配置文件
├── .stylelintrc.json # stylelintrc配置文件
├── .env # 环境变量配置文件
├── .env.production # production模式环境变量配置文件
├── .env.development # development模式环境变量配置文件
└── tsconfig.json # ts配置文件

4 directories, 9 files
```

##### 你需要提前了解的一些事情？

模板中含有大量依赖 [Vue-class-component](https://github.com/vuejs/vue-class-component)的代码示例。

###### 相关链接

1. [Better Type Inference](https://composition-api.vuejs.org/#better-type-inference)
2. [选择启用:schema-params-middleware-joi]('https://github.com/sideway/joi')

###### 相关说明或解释

1. 模板兼容了Vue2.X，但更靠近Vue3.X的开发及使用（包含了Vue基础组件、Mixins、filter、Webpack）等。
2. 这是一个现代化开发的模板库，但更靠近未来开发，模板中全部使用typeScript作为书写语法，但你仍然可以使用js进行开发（在后续Vue3.x依然会兼容你的js代码），使用ts语法的部分并非仅包含应用主体部分，涵盖到ts-node、webpack等基础配置及环境依赖项。
3. 你可能会注意到模板中的单文件组件中大量使用了Vue.extend（在注释中）方法来导出而非直接导出一个对象，这是因为更好的类型推断，在后续的3.X版本中将被`defineComponent[原名：createComponent]`所取代，你仅需更改名字即可完成迁移，无需更改代码逻辑。
4. 模板中允许使用.js文件及代码进行开发，支持同时编译。使用ts书写的代码编译时间将慢于js代码，这是因为tsc编译时间很长的缘故。但不会影响产物包的代码。
5. 模板结构参照`flutter-cli` `vue-cli` `react-cli`设计的目录规范，在主工作目录下[src]不允许超过三层嵌套，避免使用大量的时间来追溯代码目录结构。

##### 配置文件文档参考地址

1. [ts-tsconfig](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
2. [ts-compilerOptions](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

##### 模板中使用到的技术栈

+ typescript
    1. [ts-node](https://github.com/TypeStrong/ts-node)
    2. [ts-lang](https://www.typescriptlang.org/docs/handbook/basic-types.html)
    3. [types/webpack](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/webpack?spm=a2c6h.14275010.0.0.72f64171bUvq0k)
    3. [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)
    
+ webpack
    1. [webpack-chain](https://github.com/neutrinojs/webpack-chain)
    2. [webpack](https://webpack.js.org/configuration/)
+ vue
    1. [vue](https://vuejs.org/v2/api/)
    2. [vuex](https://vuex.vuejs.org/api/)
    3. [vue-router](https://router.vuejs.org/api/)
    4. [vue-class-component](https://class-component.vuejs.org)
    5. [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator#usage)
    6. [vuex-class](https://github.com/ktsn/vuex-class)
+ http
    1. [axios](https://github.com/axios/axios#axios-api)
    2. [选择启用：schema-params-middleware-joi](https://github.com/sideway/joi/blob/master/API.md)
+ environment
    1. [https://github.com/motdotla/dotenv#config](https://github.com/motdotla/dotenv#config)
+ cookie
    1. [js-cookie](https://github.com/js-cookie/js-cookie#basic-usage)
+ date
    1. [已在webpack打包中优化体积:moment](https://momentjs.com/docs/#/parsing)
+ eslint
    1. [eslint-vue](https://eslint.vuejs.org/)
    2. [airbnb-base](https://github.com/airbnb/javascript)
