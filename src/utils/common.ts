export function deepCopy<T = object>(obj: any, cache: {original: T, copy: T}[] = []): T {
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // if obj is hit, it is in circular structure
    type HitType = {original: T, copy: T};
    const hit: HitType | undefined = cache.find((value: any) => value?.original === obj);
    if (hit) {
        return hit?.copy;
    }

    const copy: T | any = Array.isArray(obj) ? [] : {};
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy,
    });

    Object.keys(obj).forEach((key: any) => {
        copy[key] = deepCopy<T>(obj[key], cache);
    });

    return copy;
}

export function isPromise(val: Promise<any>): boolean{
    return val && typeof val.then === 'function';
}

export function randomString(len: number = 32) : string{ // 随机字符串32
    const $chars: string = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos: number = $chars.length;
    /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
    let pwd: string = '';
    // eslint-disable-next-line no-plusplus
    for (let i: number = 0; i < len; i++) pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    return pwd;
}

export function urlEncode(clearString: string): string { // url编码
    const regex: RegExp = /(^[a-zA-Z0-9-_.]*)/;
    const newClearString: string = String(clearString);
    let output: string = '';
    let x: number = 0;
    while (x < newClearString.length) {
        const match: RegExpExecArray | null = regex.exec(newClearString.substr(x));
        if (match !== null && match.length > 1 && !!match[1].length) {
            output += match[1]; x += match[1].length;
        } else {
            if (!newClearString.substr(x, 1).length) output += '+'; // ie不支持把字符串当作数组来访问
            else {
                const charCode: number = newClearString.charCodeAt(x);
                const hexVal: string = charCode.toString(16);
                output += `%${hexVal.length < 2 ? '0' : ''}${hexVal.toUpperCase()}`;
            }
            x += 1;
        }
    }
    return output;
}

export function typeOf(obj: any): string { // 精准判断数据类型
    const _obj:{
        [typeName: string]: string
    } = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object',
        '[object Document]': 'document',
        '[object HTMLDivElement]': 'div',
        '[object HTMLBodyElement]': 'body',
        '[object HTMLDocument]': 'document',
        '[object HTMLHtmlElement]': 'html',
        '[object Blob]': 'blob',
        '[object FormData]': 'formData',
    };
    return _obj[Object.prototype.toString.call(obj)];
}

export function toCapital(n: number | string): string { // 将数字转为大写
    const cNum: string[] = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    let s: string = '';
    Object.values(String(n)).forEach((item: string) => {
        // eslint-disable-next-line radix
        s += cNum[parseInt(n.toString().charAt(Number(item)), 10)];
    });
    if (s.length === 2) { /* 两位数的时候 */
        if (s.charAt(1) === cNum[0]) { // 如果个位数是0的时候，令改成十
            s = s.charAt(0) + cNum[10];
            // 如果是一十改成十
            if (s === (cNum[1] + cNum[10])) {
                // eslint-disable-next-line prefer-destructuring
                s = cNum[10];
            }
        } else if (s.charAt(0) === cNum[1]) s = cNum[10] + s.charAt(1);
    } // 如果十位数是一的话改成十
    return s;
}

export function hyphenate (str: string): string{
    const hyphenateRE: RegExp = /([^-])([A-Z])/g;
    return str
        .replace(hyphenateRE, '$1-$2')
        .replace(hyphenateRE, '$1-$2')
        .toLowerCase();
}