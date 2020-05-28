/**
 * Created by dean on 2016/10/1.
 */
function json2url(json) {
    var arr = [];
    for (var name in json) {
        arr.push(name + '=' + json[name]);
    }
    return arr.join('&');
}

function ajax(json) {
    json = json || {};
    if (!json.url) return;
    json.timeout = json.timeout || 5000;
    json.data = json.data || {};
    json.type = json.type || 'get';
    json.data.t = Math.random();

    if (window.XMLHttpRequest) {
        var oAjax = new XMLHttpRequest();
    } else {
        var oAjax = new ActiveXObject('Microsoft.XMLHTTP');
    }

    switch (json.type.toLowerCase()) {
        case 'get':
            oAjax.open('GET', json.url + '?' + json2url(json.data), true);
            oAjax.send();
            break;
        case 'post':
            oAjax.open('POST', json.url, true);
            oAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            oAjax.send(json2url(json.data));
            break;
    }

    json.loading && json.loading();
    json.timer = setTimeout(function () {
        oAjax.onreadystatechange = null;
        json.error && json.error('网络超时');
    }, json.timeout);

    oAjax.onreadystatechange = function () {
        if (oAjax.readyState == 4) {
            clearTimeout(json.timer);
            if (oAjax.status >= 200 && oAjax.status < 300 || oAjax.status == 304) {
                json.success && json.success(oAjax.responseText);
            } else {
                json.error && json.error(oAjax.status);
            }
        }
    }

}

function sum() {
    let result = 0;
    for (let i in arguments) {
        result += arguments[i];
    }
    return result;
}
