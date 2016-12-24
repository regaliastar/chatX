var express = require('express');
var path = require('path');
var routes = require('./routes/index');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var handlebars = require('express3-handlebars').create();
var PORT = 80;
var characters = require('./models/characters');
var History = require('./models/history');
var async = require('async');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("数据库成功开启");
});


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
var roomAvator = {};


io.on('connection', function (socket) {

    // 获取用户当前的url，从而截取出房间id
    var url = socket.request.headers.referer;
    //var split_arr = url.split('/')[1];
    //var roomid = split_arr.split('?')[0] || 'index';
    var split_arr = url.split('/');
    var roomid = split_arr[split_arr.length-1] || 'index';
    //var roomid = 'chatroom';
    var user;
    var avator;

    socket.on('join', function (username,useravator) {

        user = username;
        avator = useravator;
        var newAvator = useravator;
        // 将用户归类到房间
        if (!roomUser[roomid]) {
            roomUser[roomid] = [];
        }
        if(!roomAvator[roomid]) {
            roomAvator[roomid] = [];
        }

        if(roomAvator[roomid].indexOf(avator) !== -1){
            newAvator = characters.getOther(roomAvator[roomid]);
            console.log('newAvator is:'+newAvator);
            avator = newAvator;
            roomAvator[roomid].push(newAvator);
        }else{
            roomAvator[roomid].push(avator);
        }
        

        roomUser[roomid].push(user);
        socket.join(roomid);
        socket.to(roomid).emit('sys', user + ' 加入了房间');  //sending to all clients in 'roomid' room(channel) except sender
        
        socket.emit('avator',newAvator);
       
        socket.to(roomid).emit('user_join',user);
        //socket.emit('user_join',user);
        var historyMsg = [] ;
        History.find({available:true},function(err,historys){
            console.log('History.find start');
         
            historys.map(function(history){
                var row = {user:history.user,avator:history.avator,msg:history.msg,issys:history.issys};
                if((Date.now()-history.date)/1000 > 60*60){   //如果数据库的数据保存超过了500秒，删除之
                    history.remove();
                }else{
                    historyMsg.push(row);
                }
            })


            async.series([
                function(callback){
                    socket.emit('user_first_join',roomUser[roomid],historyMsg);
                    //console.log('History.find end')       
                callback(null, 'one');
                },
                function(callback){
                    new History({
                            user:user,
                            avator:null,
                            msg:user + ' 加入了房间',
                            date:Date.now(),
                            available:true,
                            issys:true
                        }).save();
                    socket.emit('sys',user + ' 加入了房间'); 
                    //console.log('async.series 第二次执行了');
                callback(null, 'two');
                }
                ],function(err,values){
                console.log('async.series error happen! ');
            });
            //socket.emit('user_first_join',roomUser[roomid],historyMsg);
            //console.log('History.find end');
            //socket.emit('sys',user + ' 加入了房间');      //sending to sender who send 'join' to the server
        });
        //因为异步执行，会导致先执行下面的for循环再执行History.find，导致传递的时候historyMsg还是空的！
        /*console.log('for 循环打印historyMsg.historys:');
        for(var o in historyMsg){
           
            console.log('o.user:'+o.user);
            console.log('o.msg:'+o.msg);
        }
        console.log('for 循环打印historyMsg.historys 打印完成！');

        socket.emit('user_first_join',roomUser[roomid],historyMsg);*/
    });

    // 监听来自客户端的消息
    socket.on('message', function (msg,avator) {
        // 验证如果用户不在房间内则不给发送
        if (roomUser[roomid].indexOf(user)< 0) {  
          return false;
        }

        if(msg.indexOf('@') !== -1){
          
        }
        //将数据保存在数据库
        new History({
            user:user,
            avator:avator,
            msg:msg,
            date:Date.now(),
            available:true,
            issys:false
        }).save();

        socket.to(roomid).emit('new message', msg,user,avator);
        socket.emit('new message', msg,user,avator);
    });

    // 关闭
    socket.on('disconnect', function () {
        // 从房间名单中移除
        socket.leave(roomid, function (err) {
            if (err) {
                log.error(err);
            } else {
                var index = roomUser[roomid].indexOf(user);
                var avaIndex = roomAvator[roomid].indexOf(avator);
                if(avaIndex !== -1){
                    roomAvator[roomid].splice(avaIndex,1);
                }

                if (index !== -1) {
                    roomUser[roomid].splice(index, 1);
                        new History({
                            user:user,
                            avator:null,
                            msg:user+'退出了房间',
                            date:Date.now(),
                            available:true,
                            issys:true
                        }).save();
                    socket.to(roomid).emit('sys',user+'退出了房间');
                    socket.to(roomid).emit('leave',user);
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
