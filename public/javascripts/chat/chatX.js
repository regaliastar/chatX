$(function () {
    /*var username;
    var url =  document.URL;
    console.log('url:'+url);
    try{
        var split_arr = url.split('/');
        var temp = split_arr[split_arr.length-1].split('?')[1];
        username = temp.split('=')[1];
    }catch(e){
        username = '匿名';
    }


    $('.name').html(username);
    */
    var input = $('.inputMessage');
    // 默认链接到渲染页面的服务器
    var socket = io();

    //取名字之后，一直进行socket.on状态，直到退出
    socket.on('connect', function () {
        var name = $('.name').text();
        socket.emit('join',name);
    })
    socket.on('sys', function (msg) {
        $('.messages').prepend('<p>'+msg+'</p>');
        // 滚动条滚动到底部
        scrollTop();
    });
    socket.on('new message', function (msg,user) {
        $('.messages').prepend('<p>'+user+'说：'+msg+'</p>');
        // 滚动条滚动到底部
        scrollTop();
    });

    $('#post').on('click',function(evt){
        var message = $('.inputMessage').val();
        socket.send(message);
        $('.inputMessage').val('');
    })

    function scrollTop() {
        $('body').animate({ scrollTop: 0 }, 200);
    }
});
