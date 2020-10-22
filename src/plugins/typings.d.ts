/// doc: https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations
// typescript 加载非自带loader的文件格式
type WebpackContent = {
    [key in (string | number)]: any
}

declare module "*.yml" { // NOTE: 非ts-loader
    const content: WebpackContent;
    export default content;
}

declare module "*.json" { // NOTE: 非ts-loader
    const value: WebpackContent;
    export default value;
}

declare module "*.vue" { // NOTE: 非ts-loader
    // const value: WebpackContent;
    import Vue from 'vue';
    export default Vue;
}
