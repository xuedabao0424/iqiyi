~function(){
    // 数据加载
    function isLoadHtml(){
        var $contents = $('.content'),
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            clientHeight = $(window).height();
        $contents.each(function (){
            if(!$(this).attr('data-loaded')){
                var top = $(this).offset().top;
                if(scrollTop >= (top - clientHeight)){
                    $(this).attr('data-loaded', true);
                    $(this).find('.content-list').eq(0).load('./json/' + $(this).attr('data-url') + '.json?' + Math.random());
                }
            }
        });
    }
    isLoadHtml();
    $(window).on('scroll', function (){
        isLoadHtml();
        loadImg();
    });
    $(window).on('resize', function (){
        isLoadHtml();
        loadImg();
    });
    // 图片延迟加载
    setTimeout(function (){
        loadImg();
    });
    function loadImg(){
        var $imgs = $('img[data-src*="./img/"]'),
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            clientHeight = $(window).height();
        $imgs.each(function (){
            var top = $(this).offset().top,
                $this = $(this);
            if(scrollTop >= (top - clientHeight - 200)) {
                var oImg = new Image();
                oImg.onload = function (){
                    $this.attr('src', oImg.src);
                    $this.animate({
                        'opacity': 1
                    });
                    $this.show();
                };
                oImg.src = $this.attr('data-src');
            }
        });
    }
    // data for loop
    function dataForLoop(){
        $.ajax({
            type: 'get',
            url: './json/banner.json',
            dataType: 'json',
            async: false,
            success: function(data){
                window.data = data;
                bindHtml(data);
            }
        });
    }
    // bindHtml
    function bindHtml(data){
        var str = ``,
            $ul = $('.banner').find('ul');
        data.forEach(function (item){
            str += `<li>
                        <a href="${item.href}">
                            <img src="${item.url}" alt="">
                        </a>
                    </li>`;
        });
        $ul.html(str);
    }
    // loop
    function loop(){
        var $banner = $('.banner'),
            $ul = $banner.find('ul'),
            $li = $ul.find('li'),
            $ol = $banner.find('ol'),
            $btns = $ol.find('li'),
            width = $banner.eq(0).width(),
            len = $li.length,
            timer = null,
            tick = 3000,
            n = 0;
        $li.css('width', width + 'px');
        $ul.append($li.eq(0).clone());
        $ul.css('width', ($li.length + 1) * width + 'px');
        function change(){
            $ul.stop().animate({
                left: -width * n + 'px'
            });
            if(n === len){
                $btns.removeClass('on').eq(0).addClass('on');
                return;
            }
            $btns.removeClass('on').eq(n).addClass('on');
            $('.new-updates span').html(window.data[n].title);
            $('.new-updates p').html(window.data[n].desc);
        }
        function next(){
            n ++;
            if(n === len + 1){
                n = 1;
                $ul.css({
                    left: 0
                });
            }
            change();
        }
        function pre(){
            n --;
            if(n < 0){
                n = len - 1;
                $ul.css({
                    left: -width * (len) + 'px'
                });
            }
            change();
        }
        change();
        timer = setInterval(next, tick);
        $banner.hover(function (){
            clearInterval(timer);
        }, function (){
            timer = setInterval(next, tick);
        });
        $btns.on('mouseenter', function (){
            n = $(this).index();
            change();
        });
    }
    dataForLoop();
    loop();
}($);
