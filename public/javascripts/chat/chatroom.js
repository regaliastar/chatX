$(function () {
 

    var input = $('.inputMessage');
    // 默认链接到渲染页面的服务器
    var socket = io();
    function scrollToBottom () {
        $('#chat-area').scrollTop($('#chat-area')[0].scrollHeight);
    };

    //取名字之后，一直进行socket.on状态，直到退出
    socket.on('connect', function () {
        var name = $('.name').text();
        socket.emit('join',name);
    })
    socket.on('sys', function (msg) {
        $('.messages').append('<p>'+msg+'</p>');
        // 滚动条滚动到底部
        scrollToBottom();
    });
    socket.on('new message', function (msg,user) {
        $('.messages').append('<p>'+user+'说：'+msg+'</p>');
        // 滚动条滚动到底部
        scrollToBottom();
    });
    input.on('keydown',function (e) {
        if (e.which === 13) {
            var message = $(this).val();
            if (!message) {
                return ;
            }
            socket.send(message);
            $(this).val('');
        }
    });
});
