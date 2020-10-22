/* eslint-disable no-unused-vars,no-eval,no-unused-vars,no-param-reassign,no-shadow,func-names */
import {VNode, VueConstructor} from 'vue';
import {DirectiveBinding, DirectiveFunction, DirectiveOptions} from "vue/types/options";

import {hyphenate} from '../utils/common';

export const onlyNumber: DirectiveOptions | DirectiveFunction = function (
    el: HTMLElement,
    { // 限制用户输入为number类型的value，行为特征跟type:number一致，但不会有样式兼容问题
        expression, value, oldValue, arg = '0',
    }: DirectiveBinding,
    vnode: VNode,
): void {
    const numberArg: number = Number(arg);
    const numberValue: number = Number(value);
    // eslint-disable-next-line no-restricted-properties
    if (oldValue === value || !isFinite(numberArg) || !value || numberValue === 0) return;

    const { context }: VNode = vnode;
    const stringArg: string = String(arg);
    const digit: number = Number(/\./.test(stringArg) ? stringArg.split('.').slice(-1)[0].length : stringArg);
    // eslint-disable-next-line no-useless-escape
    const transformValue = String(value).split('.')[1]?.length > digit ? Number(value).toFixed(digit + 1).slice(0, -1) : value; // 防止用户复制粘贴
    const newValue = new RegExp(`^\\-?\\d*\\.?\\d{0,${digit}}$`).test(transformValue) ? transformValue : oldValue; // 处理用户正常输入

    const inputEl: HTMLInputElement = (el.tagName === 'INPUT' ? <HTMLInputElement>el : <HTMLInputElement>el.querySelector('input'));
    if (inputEl === null) return;
    inputEl.onblur = ({ target }: FocusEvent) => eval(`context.${expression}=Number(target.value)||'';`);

    eval(typeof oldValue === 'undefined'
        ? `context.${expression}=Number(target.value).toFixed(digit+1).slice(0,-1);` // 第一次及时处理原始值的小数位数，后续再失去焦点才补全小数位数
        : `context.${expression}=newValue;`);
};

export default {
    install: (Vue: VueConstructor): void => {
        Vue.directive(hyphenate(onlyNumber.name), onlyNumber)
    },
};