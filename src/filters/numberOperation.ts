import {VueConstructor} from "vue";
import {hyphenate} from "../utils/common";

export type InputNumber = number | string;

export function toFixed(amount: InputNumber, fix: number, mode: 'reg' | 'fixed' = 'fixed'): InputNumber {
    // return Number(String(amount).match() || 0);

    if (mode === 'reg'){
        const reg: RegExp = new RegExp(`^\\d+(?:\\.\\d{0,${fix}})?`);
        const num: string = String(amount);
        const newNum: RegExpMatchArray | null = num.match(reg);
        const newAmount: string = newNum === null ? '' : newNum[0];

        const digit: number = newAmount.split('.')[1]?.length;

        if (digit === undefined) return `0.${new Array(fix).fill(0)}`;
        if (digit < fix) {
            const _digit: number = fix - digit;
            return newAmount + new Array(_digit).fill(0);
        }
    }

    // fixed mode
    if (amount > Number.MAX_SAFE_INTEGER || amount < Number.MIN_SAFE_INTEGER) {
        console.error('数字超出处理范围，使用reg模式能正常处理，但返回结果是"string"');
        return 0;
    }

    if (fix > 20) {
        console.error('fix值超出处理范围，使用reg模式能正常处理，但返回结果是"string"');
        return 0;
    }

    const num: number = Number(amount);
    const newNum: string = num.toFixed(fix + 1);
    const newAmount: string = newNum.slice(0, -1);
    return Number(newAmount);
}

export default {
    install: (Vue: VueConstructor): void => {
        Vue.filter(hyphenate(toFixed.name), toFixed);
    },
};