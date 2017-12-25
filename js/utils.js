var utils = (function () {
    var isCompatible = 'getElementsByClassName' in document,
        isSupportJSON = 'JSON' in window;
    var toJSON = function (str) {
        return isSupportJSON ? JSON.parse(str) : eval('(' + str + ')');
    };

    //=>css
    function getCss(curEle, attr) {
        var value = null, reg = null;
        if (isCompatible) {
            value = window.getComputedStyle(curEle, null)[attr];
        } else {
            if (attr === 'opacity') {
                value = curEle.currentStyle['filter'];
                reg = /^alpha\(opacity=(.+)\)$/i;
                return reg.test(value) ? reg.exec(value)[1] / 100 : 1;
            }
            value = curEle.currentStyle[attr];
        }
        reg = /^-?\d+(.\d+)?(pt|px|rem|em)?$/i;
        return reg.test(value) ? parseFloat(value) : value;
    }

    function setCss(curEle, attr, value) {
        if (attr === 'opacity') {
            curEle.style.opacity = value;
            curEle.style.filter = 'alpha(opacity=' + value * 100 + ')';
            return;
        }
        !isNaN(value) && !/(fontWeight|lineHeight|zoom|zIndex)/i.test(attr) ? value += 'px' : null;
        curEle.style[attr] = value;
    }

    function setGroupCss(curEle, options) {
        if (Object.prototype.toString.call(options) !== '[object Object]') return;
        for (var attr in options) {
            if (options.hasOwnProperty(attr)) {
                setCss(curEle, attr, options[attr])
            }
        }
    }

    function css() {
        var len = arguments.length,
            type = Object.prototype.toString.call(arguments[1]),
            fn = getCss;
        len >= 3 ? fn = setCss : (len === 2 && type === '[object Object]' ? fn = setGroupCss : null)
        return fn.apply(this, arguments);
    }

    return {
        toJSON: toJSON,
        css: css
    }
})();