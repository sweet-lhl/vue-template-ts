import { Component, Vue } from 'vue-property-decorator';
import {VueConstructor} from "vue";
// import {ExtendedVue} from "vue/types/vue";

function addEventListener(el: HTMLElement, type: keyof HTMLElementEventMap, method: EventListenerOrEventListenerObject, useCapture: boolean | AddEventListenerOptions = false) {
    if ('addEventListener' in Element.prototype) { // 所有主流浏览器，除了 IE 8 及更早 IE版本
        el.addEventListener(type, method, useCapture);
        return;
    }

    if ('attachEvent' in Element.prototype) { // IE 8 及更早 IE 版本
        // @ts-ignore
        el.attachEvent(`on${type}`, method, useCapture);
        return;
    }
}

function removeEventListener(el: HTMLElement, type: keyof HTMLElementEventMap, method: EventListenerOrEventListenerObject, useCapture: boolean | AddEventListenerOptions = false) {
    if ('removeEventListener' in Element.prototype) { // 所有浏览器，除了 IE 8 及更早IE版本
        el.removeEventListener(type, method, useCapture);
        return;
    }

    if ('detachEvent' in Element.prototype) { // IE 8 及更早IE版本
        // @ts-ignore
        el.detachEvent(`on${type}`, method, useCapture);
        return;
    }
}

export interface ScrollChange{
    scrollEl?: string;
    scrollToView: (event: Event) => Error | boolean;
    handleScroll?: (status: 'start' | 'end' | 'ing') => void
}

@Component
export class ScrollMixin extends Vue implements ScrollChange{
    mounted(): boolean | Error{
        // @ts-ignore
        const { scrollEl } : {scrollEl : string} = this.$options;
        if (scrollEl) {
            addEventListener(<HTMLElement>document.getElementById(scrollEl), 'scroll', this.scrollToView);
            return false;
        }
        return new Error('缺少自定义的选项“scrollEl”，这是你监听的滚动容器[DOM-ID]，不应该是window');
    }

    scrollToView(event: Event) : Error | boolean{
        event.stopPropagation(); // 阻止下一步执行
        // @ts-ignore
        if (!this.handleScroll) return new Error('需要在methods选项中提供“handleScroll”方法，在滚动过程中会自动调用该方法');
        /* eslint no-nested-ternary: 0 */
        // @ts-ignore
        const { scrollHeight, scrollTop, clientHeight } = <MSInputMethodContext>event.target;
        const status = scrollTop === 0 ? 'start' : scrollHeight - scrollTop <= clientHeight ? 'end' : 'ing';
        // @ts-ignore
        process.nextTick(this.handleScroll.bind(this, status));
        return false;
    }

    beforeDestroy(): void{
        // @ts-ignore
        if (this.$options.scrollEl) {
            // @ts-ignore
            const { scrollEl } : {scrollEl : string} = this.$options;
            removeEventListener(<HTMLElement>document.getElementById(scrollEl), 'scroll', this.scrollToView);
        }
    }
}

/*export const ScrollMixin = Vue.extend({ // 这中写法为未来3.X版本的defineComponent书写方式，目前2.X版本仅有IDE类型提示，无类型约束
    mounted(): boolean | Error{
        const { scrollEl } : {scrollEl : string} = this.$options;
        if (scrollEl) {
            addEventListener(<HTMLElement>document.getElementById(scrollEl), 'scroll', this.scrollToView);
            return false;
        }
        return new Error('缺少自定义的选项“scrollEl”，这是你监听的滚动容器[DOM-ID]，不应该是window');
    },
    methods:{
        scrollToView(event: Event) : Error | boolean{
            event.stopPropagation(); // 阻止下一步执行
            if (!this.handleScroll) return new Error('需要在methods选项中提供“handleScroll”方法，在滚动过程中会自动调用该方法');
            /!* eslint no-nested-ternary: 0 *!/
            const { scrollHeight, scrollTop, clientHeight } = <Element>event.target;
            const status = scrollTop === 0 ? 'start' : scrollHeight - scrollTop <= clientHeight ? 'end' : 'ing';
            // @ts-ignore
            process.nextTick(this.handleScroll.bind(this, status));
            return false;
        },
    },
    beforeDestroy(): void{
        if (this.$options.scrollEl) {
            const { scrollEl } : {scrollEl : string} = this.$options;
            removeEventListener(<HTMLElement>document.getElementById(scrollEl), 'scroll', this.scrollToView);
        }
    }
});*/

export default {
    install: (Vue: VueConstructor): void => {
        Vue.mixin(ScrollMixin);
    },
};
