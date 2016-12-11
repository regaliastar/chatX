$(function () {
    // 默认链接到渲染页面的服务器
    var socket = io();
    var avator;
    //取名字之后，一直进行socket.on状态，直到退出
    socket.on('connect', function () {
        var name = $('.user_name').text() || '匿名';
        avator = $('.avator').text().trim();
        console.log('avator in connect is :'+avator)
  
        socket.emit('join',name,avator);
    })

    socket.on('sys', function (msg) {
        $('.messages').prepend('<div class="msg-system">'+'►► '+msg+'</div>');
        // 滚动条滚动到底部
        scrollTop();
    });
    
    socket.on('avator',function(ava){
        avator = ava;
        console.log('receive avator:'+ava);
    })

    socket.on('new message', function (msg,user,avator) {
        //$('.messages').prepend('<p>'+user+'说：'+msg+'</p>');
        console.log('user in new message:'+user);
        console.log('avator in new message:'+avator);
        $('.messages').prepend(
            '<div class="msg-default">'+
            '<div class="msg-user text-center">'+
            '<div class="img-avatar '+avator+'"></div>'+
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
        socket.send(message,avator);
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
            socket.send(message,avator);
            $(this).val('');
        }
    })

    function scrollTop() {
        $('body').animate({ scrollTop: 0 }, 200);
    }
});
