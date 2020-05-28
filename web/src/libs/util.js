import md from 'js-md5';
const MD5_SUFFIX = '12312SADFsfslkfsd;ewriSDFsdfsf;lk2342.sdfsd-md5签名专用';

export const md5 = (str) => {
    return md(str + MD5_SUFFIX);
}

// 电子邮箱验证
export const verifyEmail = (str) => {
    const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (reg.test(str)) {
        return true;
    } else {
        return false;
    }
}
export const verifyPhone = (str) => {
    const reg = /^1[3-9]\d{9}$/;
    if (reg.test(str)) {
        return true;
    } else {
        return false;
    }
}

export const setStorage = (key, val) => {
    if (!key) return;
    window.localStorage.setItem(key, JSON.stringify(val));
}

export const getStorage = (key) => {
    if (!key) return;
    return window.localStorage.getItem(key) !== 'undefined' ? JSON.parse(window.localStorage.getItem(key)) : null;
}

