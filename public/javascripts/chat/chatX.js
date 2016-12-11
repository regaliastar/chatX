$(function () {
    // 默认链接到渲染页面的服务器
    var socket = io();

    //取名字之后，一直进行socket.on状态，直到退出
    socket.on('connect', function () {
        var name = $('.user_name').text() || '匿名';
        socket.emit('join',name);
    })

    socket.on('sys', function (msg) {
        $('.messages').prepend('<div class="msg-system">'+'►► '+msg+'</div>');
        // 滚动条滚动到底部
        scrollTop();
    });
    
    socket.on('new message', function (msg,user) {
        //$('.messages').prepend('<p>'+user+'说：'+msg+'</p>');
        console.log('user:'+user);

        $('.messages').prepend(
            /*
            '<dl class="talk kanra">'+
            '<dt class="dropdown">'+
            '<div class="avatar avatar-kanra"></div>'+
            '<div class="name" data-toggle="dropdown">'+
            '<span class="select-text">'+user+'</span>'+
            '</div>'+
            '<ul class="dropdown-menu" role="menu"></ul>'+
            '</dt>'+
            '<dd>'+
            '<div class="bubble">'+
            '<div class="tail-wrap center" style="background-size: 65px auto;">'+
            '<div class="tail-mask"></div>'+
            '</div>'+
            '<p class="body select-text">'+msg+'</p>'+
            '</div>'+
            '</dd>'+
            '</dl>'
            */
            '<div class="msg-default">'+
            '<div class="msg-user text-center">'+
            '<div class="img-avatar emt"></div>'+
            user+
            '</div>'+
            '<div class="msg-bubble bounce" >'+
            msg+
            '</div>'+
            '</div>'
            );
           
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
            if(evt.shiftKey){
                return;
            }
            var message = $(this).val();
            if(message == ''){
                evt.preventDefault();
            }
            socket.send(message);
            $(this).val('');
        }
    })

    function scrollTop() {
        $('body').animate({ scrollTop: 0 }, 200);
    }
});
