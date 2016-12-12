var express = require('express');
var router = express.Router();
var characters = require('./../models/characters');
//此处不能用post


router.get('/register',function(req,res,next){
	if(req.cookies.userId){
		var userId = req.cookies.userId;
		console.log('cookies get: '+userId+' '+new Date());
		//res.render('chatroom',{id:""+userId});
		res.redirect(303,'chatX');
	}else{
		res.render('register');
	}
	
})
/*
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
*/
//it's only used to test UI
router.post('/chatX',function(req,res,next){
	var userId = req.body.userId.trim() || '匿名';
	var userAvator = characters.getCharacter();
	console.log('userAvator:'+userAvator);
	req.session.username = userId;
    req.session.avator = characters.getCharacter();

	if(!req.cookies.userId){
		res.cookie('userId',''+userId, {maxAge:1*1000, path:'/', httpOnly:true});	
	}
	res.render('chatX',{id:""+userId,avator:""+userAvator});
	
})

router.get('/chatX/:id',function(req,res,next){
	/*var userId = req.body.userId.trim() || '匿名';
	if(!req.cookies.userId){
		res.cookie('userId',''+userId, {maxAge:1*1000, path:'/', httpOnly:true});	
	}
	res.render('chatX',{id:""+userId});*/
	res.render('chatX',{id:'匿名'});
})


router.use('/',function(req,res,next){
	res.redirect(303,'register');
});

module.exports = router;

