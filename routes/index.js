var express = require('express');
var router = express.Router();

//此处不能用post
router.get('/compute',function(req,res,next){
	res.render('compute');
});

router.get('/register',function(req,res,next){
	if(req.cookies.userId){
		var userId = req.cookies.userId;
		console.log('cookies get: '+userId+' '+new Date());
		//res.render('chatroom',{id:""+userId});
		res.redirect(303,'chatroom');
	}else{
		res.render('register');
	}
	
})

router.post('/chatroom',function(req,res,next){
	var userId = req.body.userId.trim() || '匿名';				//得到post提交的表单信息
	if(!req.cookies.userId){
		res.cookie('userId',''+userId, {maxAge:1*1000, path:'/', httpOnly:true});	
	}
	res.render('chatroom',{id:""+userId});
});

router.get('/chatroom',function(req,res,next){
	var userId = req.body.userId || '匿名';	
	if(!req.cookies.userId){
		res.cookie('userId',''+userId);
		console.log('userId is:'+userId);
		
	}else{
		userId = req.cookies.userId;

	}
	res.render('chatroom',{id:""+userId});
})

//it's only used to test UI
router.use('/chatX',function(req,res,next){
	var userId = req.body.userId.trim() || '匿名';
	if(!req.cookies.userId){
		res.cookie('userId',''+userId, {maxAge:1*1000, path:'/', httpOnly:true});	
	}
	res.render('chatX',{id:""+userId});
	
})

router.use('/:others',function(req,res,next){
	res.send('hello!，你进错地方了哟');
});

module.exports = router;

