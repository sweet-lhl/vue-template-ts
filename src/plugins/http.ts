import os from 'os';
import http, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'; /// doc: https://github.com/axios/axios#axios-api
import moment from 'moment'; /// doc: https://momentjs.com/docs
import cookies from 'cookies-js'; /// doc: https://github.com/ScottHamper/Cookies

import i18n from '../setup/i18n-setup';
import router from '../setup/router-setup';
import { typeOf, deepCopy } from '../utils/common';

export { AxiosInstance };

enum AcceptType {
    Json = 'application/json ',
    Plain = 'ext/plain',
    Multipart = 'application/x-www-form-urlencoded'
}

const xhrDefaultConfig: AxiosRequestConfig = {
    headers: {
        OS: JSON.stringify({
            platform: os.platform(),
            totalmem: os.totalmem(),
            freemem: os.freemem(),
            endianness: os.endianness(),
            arch: os.arch(),
            tmpdir: os.tmpdir(),
            type: os.type(),
        }),
        'Content-Type': `${AcceptType.Json};charset=UTF-8`, /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
        'Cache-Control': 'no-cache', /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
        deviceID: `WEB-${window.navigator.userAgent}`,
        Accept: AcceptType.Json, /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
        // Connection: 'Keep-Alive', /// HTTP1.1, https://en.wikipedia.org/wiki/HTTP_persistent_connection
        // 'Accept-Encoding': 'gzip', /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
        // 'Accept-Charset': 'utf-8', /// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Charset
    },
    // timeout: 1000,
};

function httpInit(instance: AxiosInstance): AxiosInstance{
    instance.interceptors.request.use((config: AxiosRequestConfig): any => ({
        ...config,
        headers: {
            ...config.headers,
            token: cookies.get('token'),
            'X-B3-Traceid': moment().valueOf() * 1000, // Traceid
            'X-B3-Spanid': moment().valueOf() * 1000, // Spanid
            'Accept-Language': i18n.locale, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
        },
        transformRequest: [
            (data: {[key: string]: any}, headers: {[key: string]: any}) => {
                switch (true){
                    case headers['Accept'] === AcceptType.Json:
                        return  JSON.stringify(data)
                    case headers['Accept'] === AcceptType.Plain:
                        return  JSON.stringify(data);
                    case headers['Accept'] === AcceptType.Multipart:
                        return  Object.entries(data).reduce((acc: FormData, cur: [string, any]): FormData => {
                        acc.append(...cur);
                        return acc;
                    }, new FormData());
                    default:
                        break;
                }
            },
        ],
    }), (error: Error) => {
        // toast(error.message);
        return Promise.reject(error);
    });

    instance.interceptors.response.use((response: AxiosResponse): any => {
        const {
            data,
            config
        }: {
            data: any,
            config: AxiosRequestConfig
        } = response;

        let newData: {[key: string]: any} = deepCopy(data);

        if (typeOf(newData) !== 'object') return newData

        switch (true) {
            case newData.code == 0: // 去登录示例
                // toast('请登录');
                cookies.expire('token');
                router.replace('login');
                return Promise.reject(new Error(`${data.code} 登录超时`));
            case newData.status === 1: // 正常
                return newData.data;
            case newData.result === 'success': // 正常
                return newData.content;
            default:
                return Promise.reject(new Error(newData?.msg || newData?.message));
        }
    }, (error) => {
        const { response, /*__CANCEL__*/ } = error;
        // if (!__CANCEL__) toast(response.message || response.data.message); // 非主动取消请求的接口
        throw new Error(response);
    });

    return instance;
}

// TODO: 待实现类似React.hook方法用于取消当前正在进行的接口操作;[https://github.com/axios/axios#cancellation]

export default typeof Proxy === 'undefined' ? {
    instance: (uri: string): AxiosInstance => {
        const { baseURL = uri, timeout, headers } = xhrDefaultConfig;
        return httpInit(http.create({
            baseURL,
            timeout,
            headers
        }));
    },
} : new Proxy(Object.create(null),
    {
        get(target, key: string): AxiosInstance | null {
            if (key === 'instance') {
                throw new Error('当前运行环境支持Proxy，已阻断调用instance方法获取HTTP实例');
                return null;
            }
            const { baseURL = key, timeout, headers } = xhrDefaultConfig;
            return httpInit(http.create({
                baseURL,
                timeout,
                headers
            }));
        },
    });
