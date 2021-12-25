function create (type, data, msg, name){
    var out = 'https://simabot.github.io/notify?type=' + type + '&data=' + btoa(encodeURIComponent(data)) + '&msg=' + encodeURIComponent(msg);
    if(name){
        out += '&name=' + name;
    }
    return out;
}

function parser (url) {
    // https://simabot.github.io/notify?type=%type%&data=%data%&msg=%msg%

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
    if (urlObj.host != 'simabot.github.io') {
        return { error: '05' };
    }
    if (urlObj.pathname != '/notify') {
        return { error: '06' };
    }
    const params = urlObj.searchParams;
    var type = params.get('type');
    if (!type) {
        return { error: '07' };
    }
    var channelName;
    if (type == 'channel') {
        channelName = params.get('name');
        if (!channelName) {
            return { error: '13' };
        }
        if (!notify.channels[channelName]) {
            return { error: '14' };
        }
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
    return { msg: msg, type: type, data: data, name: channelName };
}

const typeNotify = document.getElementById('type-notify');
const dataNotify = document.getElementById('data-notify');
const msgNotify = document.getElementById('msg-notify');
const nameNotify = document.getElementById('name-notify');
const outputElement = document.getElementById('output');
const nameEditor = document.getElementById('name-editor');

function update() {
    const type = typeNotify.selectedOptions[0].value;
    if(type == 'channel') {
        nameEditor.style.display = 'block';
    }else{
        nameEditor.style.display = 'none';
    }

    const url = create(type, dataNotify.value, msgNotify.value, nameNotify.selectedOptions[0].value);
    outputElement.value = url;
}

update();

nameNotify.onchange = dataNotify.oninput = msgNotify.oninput = typeNotify.onchange = update;
