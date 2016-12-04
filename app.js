var express = require('express');
var path = require('path');
var routes = require('./routes/index');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var handlebars = require('express3-handlebars').create();
var PORT = 8081;
app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars',handlebars.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser());
app.use(cookieParser('cookieSecret_saveinafile'));
app.use(expressSession());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));

app.use('/',routes);
/*
var server = http.createServer(function(req,res){
	req.on('data',function(data){
		userId = decodeURIComponent(data);
		console.log("server内req.on响应，id:"+userId);
	});
});
server.listen(PORT);
*/
var server = http.Server(app);
var io = require('socket.io').listen(server);
var roomUser = {};
io.on('connection', function (socket) {

    // 获取用户当前的url，从而截取出房间id
    var url = socket.request.headers.referer;
    var split_arr = url.split('/')[1];
    var roomid = split_arr.split('?')[0] || 'index';
    //var roomid = 'chatroom';
    var user = '';

    socket.on('join', function (username) {
         user = username;
        // 将用户归类到房间
        if (!roomUser[roomid]) {
            roomUser[roomid] = [];
        }
        roomUser[roomid].push(user);
        socket.join(roomid);
        socket.to(roomid).emit('sys', user + ' 加入了房间');  //sending to all clients in 'roomid' room(channel) except sender
        socket.emit('sys',user + ' 加入了房间');      //sending to sender who send 'join' to the server
    });

    // 监听来自客户端的消息
    socket.on('message', function (msg) {
        // 验证如果用户不在房间内则不给发送
        if (roomUser[roomid].indexOf(user)< 0) {  
          return false;
        }
        socket.to(roomid).emit('new message', msg,user);
        socket.emit('new message', msg,user);
    });

    // 关闭
    socket.on('disconnect', function () {
        // 从房间名单中移除
        socket.leave(roomid, function (err) {
            if (err) {
                log.error(err);
            } else {
                var index = roomUser[roomid].indexOf(user);
                if (index !== -1) {
                    roomUser[roomid].splice(index, 1);
                    socket.to(roomid).emit('sys',user+'退出了房间');
                } 
            }
        });
    });
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(PORT);
console.log("服务器启动，监听端口:"+PORT);
