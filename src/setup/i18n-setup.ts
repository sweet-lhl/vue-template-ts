import Vue from 'vue';
import VueI18n from 'vue-i18n';

import http from '../plugins/http'

import en_US from '../lang/en-US.yml';
import zh_CN from '../lang/zh-CN.yml';

Vue.use(VueI18n);

const isProduction: boolean = process.env.NODE_ENV === 'production';
const localeDefault: string = window.navigator.language;

const messages: VueI18n.LocaleMessages = { // 语言包
    'en-US': en_US,
    'zh-CN': zh_CN,
};

const languages: VueI18n.Locale[] = Object.keys(messages);

const fallbackLocale: VueI18n.Locale = languages.includes(localeDefault)
    ? localeDefault
    : languages.find(lan => lan.indexOf(localeDefault.split('-')[0]) > -1) || localeDefault;

const i18n: VueI18n = new VueI18n({
    locale: fallbackLocale, // 设置语言环境
    fallbackLocale, // 如果未找到key,需要回溯到语言包的环境
    silentTranslationWarn: isProduction, // 警告信息
    messages, // 设置语言环境信息
});

export function setI18nLanguage(lang: VueI18n.Locale = fallbackLocale): VueI18n.Locale { // 设置规则：完全匹配 -> 模糊匹配 -> 默认语言
    const { locale, availableLocales }: {
        locale: VueI18n.Locale,
        availableLocales: VueI18n.Locale[]
    } = i18n;

    if (locale === lang) return lang; // 不允许重复设置语言
    const language: VueI18n.Locale = availableLocales.includes(lang)
        ? lang
        : availableLocales.find((lan: VueI18n.Locale) => lan.indexOf(lang.split('-')[0]) > -1) || localeDefault;

    [
        i18n.locale, // set vue-i18n
        // @ts-ignore
        http.defaults.headers?.common['Accept-Language'], // set http
    ] = new Array(2).fill(language);

    document.documentElement?.setAttribute('lang', language.split(/-/)[0]); // set html
    return language;
}

export default i18n;
