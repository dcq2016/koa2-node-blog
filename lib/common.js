const crypto = require('crypto');

module.exports = {
    MD5_SUFFIX: '12312SADFsfslkfsd;ewriSDFsdfsf;lk2342.sdfsd-md5签名专用',
    md5: function (str) {
        let obj = crypto.createHash('md5');
        obj.update(str+this.MD5_SUFFIX);

        return obj.digest('hex');
    }, 
    toDou(n){
        return n<10?'0'+n:''+n;
    }
}