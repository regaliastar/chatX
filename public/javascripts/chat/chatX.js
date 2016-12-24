$(function () {
    // 默认链接到渲染页面的服务器
    var socket = io();
    var avator;
    //取名字之后，一直进行socket.on状态，直到退出
    socket.on('connect', function () {
        var name = $('.user_name').text() || '匿名';
        avator = $('.avator').text().trim();
        console.log('avator in connect is :'+avator);
        
        socket.emit('join',name,avator);
    })

    //生成用户列表
    socket.on('user_first_join',function(userlist,historyMsg){
        for(var i=0;i<userlist.length;i++){

            $('#user_list').append(
               '<li id="'+userlist[i]+'" class="dropdown clearfix symbol-tanaka-2x" device="desktop" style="color: black;background: #545454;border:1px dotted black">'+
                   ' <ul id="'+userlist[i]+'" class="dropdown-menu" role="menu" ></ul>'+
                    '<div id="'+userlist[i]+'" class="name-wrap" data-toggle="dropdown" >'+
                    '<span id="'+userlist[i]+'" class="select-text name" >'+userlist[i]+'</span>'+
                    '</div>'+
                    '<span id="'+userlist[i]+'" class="icon-display icon-device"></span>'+
                    '<span id="'+userlist[i]+'" class="icon icon-users"></span>'+
                '</li>'
                );
        }

        if(historyMsg !== null){
            //添加历史记录
            console.log("打印了historyMsg");
            for(var o in historyMsg){
            $('.messages').prepend(
            '<div class="msg-default">'+
            '<div class="msg-user text-center">'+
            '<div class="img-avatar '+historyMsg[o].avator+'"></div>'+
            historyMsg[o].user+
            '</div>'+
            '<div class="msg-bubble bounce" >'+
            historyMsg[o].msg+
            '</div>'+
            '</div>'
            );
           
        // 滚动条滚动到底部
        scrollTop();
        }
        }


    })

    socket.on('user_join',function(user){
        console.log(user+'加入了房间-user_join接收');
        //将用户添加到面板


        $('#user_list').append(
               '<li id="'+user+'" class="dropdown clearfix symbol-tanaka-2x" device="desktop" style="color: black;background: #545454">'+
                   ' <ul id="'+user+'" class="dropdown-menu" role="menu" ></ul>'+
                    '<div id="'+user+'" class="name-wrap" data-toggle="dropdown" >'+
                    '<span id="'+user+'" class="select-text name" >'+user+'</span>'+
                    '</div>'+
                    '<span id="'+user+'" class="icon-display icon-device"></span>'+
                    '<span id="'+user+'" class="icon icon-users"></span>'+
                '</li>'
                );
    });

    socket.on('leave',function(user){
        console.log(user+' 离开了房间-leave');
        $('#'+user).remove();
    })

    socket.on('sys', function (msg) {
        $('.messages').prepend('<div class="msg-system">'+'►► '+msg+'</div>');
        // 滚动条滚动到底部
        scrollTop();
    });
    
    socket.on('avator',function(ava){
        avator = ava;
        console.log('receive avator:'+ava);
    });

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

    $('#setting_pannel').on('click',function(evt){
        var target = evt.target.getAttribute('id');
        if(target === null) return;
        var at = $('.inputMessage').val() + '@' + target+' ';
        $('.inputMessage').val(at);

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
