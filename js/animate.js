~function () {
    function Linear(t, b, c, d) {
        return c * t / d + b;
    }
    /*
     * animate：支持指定时间内的多方向匀速或者非匀速运动动画库
     * @parameter
     *   options.curEle：当前需要运动的元素
     *   options.target：目标位置信息 {xxx:xxx...}
     *   options.duration：运动的总时间
     *   options.effect：运动的方式(匀速或者非匀速:它是一个运动的公式)
     *   options.callBack：回调函数，当动画运行完成后需要做的事情，当做回调函数传递进来即可
     */
    function animate(options) {
        //=>init parameter
        var _default = {
            curEle: null,
            target: null,
            duration: 1000,
            effect: Linear,
            callBack: null
        };
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                _default[key] = options[key];
            }
        }
        var curEle = _default.curEle,
            target = _default.target,
            duration = _default.duration,
            effect = _default.effect,
            callBack = _default.callBack;

        //=>prepare T/B/C/D
        var time = null,
            begin = {},
            change = {};
        for (key in target) {
            if (target.hasOwnProperty(key)) {
                begin[key] = utils.css(curEle, key);
                change[key] = target[key] - begin[key];
            }
        }
        //=>running
        clearInterval(curEle.animateTimer);
        curEle.animateTimer = setInterval(function () {
            time += 17;
            if (time >= duration) {
                utils.css(curEle, target);
                clearInterval(curEle.animateTimer);
                //=>run callBack
                //typeof callBack === 'function' ? callBack.call(curEle) : null;
                callBack && callBack.call(curEle);
                return;
            }
            var curPos = {};
            for (var key in target) {
                if (target.hasOwnProperty(key)) {
                    curPos[key] = effect(time, begin[key], change[key], duration);
                }
            }
            utils.css(curEle, curPos);
        }, 17);
    }
    window.animate = animate;
}();