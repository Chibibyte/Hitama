function handleDbError(context, data, hideError = false) {
    if (!data || data.dbError) {
        let { name, message, value } = data.dbError;
        let msg = message;
        let msg2 = value;
        if (!hideError) context.commit('setShowInfo', { value: true, title: name, text: msg, text2: msg2, type: 'danger' });
        return false;
    }
    return true;
}

function replaceFalsy(val, replacement) {
    return val ? val : replacement;
}

async function routerPush(router, path) {
    try {
        await router.push(path);
    } catch (e) {
        if (e.name === 'NavigationDuplicated') return router.push('/redirect');
        console.error(e);
    }
}

function doubleDigits(val) {
    return val < 10 ? ('0' + val) : val + '';
}

function formatDate(dateString) {
    let date = new Date(dateString);
    let day = doubleDigits(date.getDate());
    let month = doubleDigits(date.getMonth() + 1);
    let year = date.getFullYear();
    let hours = doubleDigits(date.getHours());
    let minutes = doubleDigits(date.getMinutes());
    return { date: `${day}/${month}/${year}`, time: `${hours}:${minutes}` };
}

function dateTime(timestamp) {
    let dt = formatDate(timestamp);
    return `${dt.date}\n${dt.time}`;
}

function copyObj(target, source, ...names) {
    let _names = Object.keys(source);
    if (names.length > 0) _names = [...names];
    _names.forEach(name => target[name] = source[name]);
    return target;
}

function objectFilter(obj, names, whitelist = false) {
    let workable = obj._doc ? obj._doc : obj;
    let useNames = names;
    if (whitelist) useNames = Object.keys(workable).filter(key => !names.includes(key));
    useNames.forEach(name => delete workable[name]);
}

function outputFilterInPlace(data, names, whitelist = false) {
    let innerNames = [...names];
    let out = {};
    if (Array.isArray(data)) out = data.map(d => {
        let newObj = {};
        copyObj(newObj, d);
        return newObj;
    });
    else copyObj(out, data);
    if (Array.isArray(out)) out.forEach(d => {
        objectFilter(d, innerNames, whitelist);
    });
    else objectFilter(out, innerNames, whitelist);
    return out;
}

function dataObj(name, value) {
    return { name, value };
}


function reqData(...data) {
    let out = data.filter(d => ((d.value === false) || d.value));
    return out;
}

module.exports = {
    copyObj,
    outputFilterInPlace,
    routerPush,
    formatDate,
    dataObj,
    reqData,
    handleDbError,
    dateTime,
    replaceFalsy
};