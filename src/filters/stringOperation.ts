import {VueConstructor} from "vue";
import {hyphenate} from "../utils/common";

export type InputStr = string | number;

export function strIntercept(str: InputStr, length: number = 3): string { // 过滤中间信息，不予展示
    const newStr: string = String(str);
    const prefix: RegExpMatchArray | null = newStr.match(new RegExp(`^[\\s\\S]{${length}}`));
    const suffix: RegExpMatchArray | null = newStr.match(new RegExp(`[\\s\\S]{${length}}$`));
    return `${prefix}****${suffix}`;
}

export default {
    install: (Vue: VueConstructor): void => {
        Vue.filter(hyphenate(strIntercept.name), strIntercept);
    },
};
