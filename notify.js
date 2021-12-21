function create (type, data, msg){
    return 'https://simabot.github.com/notify?type=' + type + '&data=' + btoa(encodeURIComponent(data)) + '&msg=' + encodeURIComponent(msg);
}

function parser (url) {
    // https://simabot.github.com/notify?type=%type%&data=%data%&msg=%msg%

    // % type % = url(https://youtube.com/watch?v=???), msg (find cat), channel (shindo, etc)
    // % data % =-------------^ ---------------------------------^ ----------------------^ ----^
    // % msg % = New picture of cat[]!

    var urlObj = null;

    try {
        urlObj = new URL(url);
    }
    catch (err) {
        return { error: '04' };
    }

    if (!urlObj) {
        return { error: '03' };
    }
    if (urlObj.host != 'simabot.github.com') {
        return { error: '05' };
    }
    if (urlObj.path != '/notify') {
        return { error: '06' };
    }
    const params = urlObj.searchParams;
    var type = params.get('type');
    if (!type) {
        return { error: '07' };
    }
    const allowedTypes = ['url', 'msg', 'channel'];
    if (allowedTypes.indexOf(type) == -1) {
        return { error: '10' };
    }
    var data = params.get('data');
    if (!data) {
        return { error: '08' };
    }
    data = decodeURIComponent(atob(data));
    var msg = params.get('msg');
    if (!msg) {
        return { error: '09' };
    }
    msg = decodeURIComponent(msg);
    return { msg: msg, type: type, data: data };
}

const typeNotify = document.getElementById('type-notify');
const dataNotify = document.getElementById('data-notify');
const msgNotify = document.getElementById('msg-notify');
const outputElement = document.getElementById('output');

function update() {
    const url = create(typeNotify.selectedOptions[0].value, dataNotify.value, msgNotify.value);
    outputElement.value = url;
}

setInterval(update, 100);