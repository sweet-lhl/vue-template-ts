import {VueConstructor} from "vue";
import {deepCopy, hyphenate, typeOf} from "../utils/common";

export type ArrayItemType = string & any[] & {[key in (string | number)]: any};

export function arraySort<T extends ArrayItemType>(sourceData: T[], attr: string, rev: number = 1): T[]{

    return Array.prototype.sort.call(
        deepCopy(sourceData),
        (a: T, b: T) => {
            let old: any = a;
            let cur: any = b;

            if (typeOf(a) === 'object'){
                old = attr?.split('.').reduce((acc: T, cur: string): T => acc[cur], a);
            }
            if (typeOf(b) === 'object'){
                cur = attr?.split('.').reduce((acc: T, cur: string): T => acc[cur], b);
            }

            return (old - cur) * rev;
        }
    );
}

export default {
    install: (Vue: VueConstructor): void => {
        Vue.filter(hyphenate(arraySort.name), arraySort);
    },
};
