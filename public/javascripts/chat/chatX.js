$(function () {
    // 默认链接到渲染页面的服务器
    var socket = io();

    //取名字之后，一直进行socket.on状态，直到退出
    socket.on('connect', function () {
        var name = $('.name').text();
        socket.emit('join',name);
    })
    socket.on('sys', function (msg) {
        $('.messages').prepend('<p>'+'►► '+msg+'</p>');
        // 滚动条滚动到底部
        scrollTop();
    });
    socket.on('new message', function (msg,user) {
        //$('.messages').prepend('<p>'+user+'说：'+msg+'</p>');
        $('.messages').prepend(
            '<dl class="talk tanaka-2x">'+
            '<dt class="dropdown">'+
            '<div class="avatar avatar-tanaka-2x">'+
            '<div class="name" data-toggle="dropdown">'+
            '<span class="select-text">'+user+'</span>'+
            '</div>'+
     
            '<ul class="dropdown-menu" role="menu"></ul>'+
            '</dt>'+
            '<dd class="bounce">'+
            '<div class="bubble">'+
            '<div class="tail-wrap center" style="background-size: 65px auto;">'+
            '<div class="tail-mask"></div>'+
            '</div>'+
            '<p class="body select-text">'+msg+'</p>'+
            '</div>'+
            '</dd>'+
            '</dl>');
        // 滚动条滚动到底部
        scrollTop();
    });

    $('#post').on('click',function(evt){
        var message = $('.inputMessage').val();
        socket.send(message);
        $('.inputMessage').val('');
    })

    $('.inputMessage').on('keydown',function(evt){
        if(evt.which === 13){
            var message = $(this).val();
            if(!message || message.trim() == ''){
                return;
            }
            socket.send(message);
            $(this).val('');
        }
    })

    function scrollTop() {
        $('body').animate({ scrollTop: 0 }, 200);
    }
});
