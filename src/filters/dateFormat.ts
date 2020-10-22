import {VueConstructor} from "vue";
import moment, {unitOfTime, MomentInput, Duration} from 'moment';
import {arraySort, ArrayItemType} from '../filters/arraySort';
import {hyphenate} from "../utils/common";

export interface DateDiff{
    years: number;
    months: number;
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}

export function timeStampToDate(timeStamp: number, reg: string = 'YYYY.MM.DD HH:mm:ss'): string{ // 时间戳转时间
    if (!timeStamp) return '---';
    return moment(timeStamp).format(reg);
}

export function timeDuration(start: MomentInput, end: MomentInput, key: unitOfTime.Diff): number | DateDiff { // 时间周期，支持单独获取一个key的时间周期
    const momentDiff: number = moment(start).diff(moment(end), key, true);
    const timeDuration: Duration = moment.duration(momentDiff);
    return key ? momentDiff : {
        years: timeDuration.get('years'),
        months: timeDuration.get('months'),
        weeks: timeDuration.get('weeks'),
        days: timeDuration.get('days'),
        hours: timeDuration.get('hours'),
        minutes: timeDuration.get('minutes'),
        seconds: timeDuration.get('seconds'),
        milliseconds: timeDuration.get('milliseconds'),
    };
}

export function flowsGroup<T>(flows: any[], attr: string, key: unitOfTime.StartOf = 'day') { // 数据分组处理
    type FlowItem = T & { [key: string]: MomentInput};
    return arraySort<ArrayItemType & FlowItem>(flows, attr, -1).reduce((acc: Array<FlowItem[]>, cur: FlowItem) => {
        const lastFlows: FlowItem[] = acc.slice(-1).flat();
        const lastFlow: FlowItem = lastFlows.slice(-1)[0] || <FlowItem>{};
        /* [isoWeek[1-7],week[7-6]] */
        const condition = moment(<MomentInput>lastFlow[attr]).isSame(<MomentInput>cur[attr], key); // 按照时间进行分组
        if (condition) {
            acc.splice(-1, 1, lastFlows.concat(cur));
            return acc;
        }
        return [...acc, [cur]];
    }, []);
}

export default {
    install: (Vue: VueConstructor): void => {
        Vue.filter(hyphenate(timeStampToDate.name), timeStampToDate);
        Vue.filter(hyphenate(timeDuration.name), timeDuration);
        Vue.filter(hyphenate(flowsGroup.name), flowsGroup);
    },
};
