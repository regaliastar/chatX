//将中缀表达式转换成后缀表达式
function transInfix(express){
	var expression = express;
	//设置运算符的优先级，其中'('最低
	var privilege = {'+':0,'-':0,'*':1,'/':1,'(':-1,
					 '%':1,'&':1,'|':1,'~':1,'!':1,
					 's':2,'c':2,'t':2,'a':2,'l':2,
					 'q':2};	
	var stack = Array();
	var result = '';	//用于存放后缀表达式的字符串

	for(var i=0;i<expression.length;i++){
		var curChar = expression[i];

		if(curChar===' ' || curChar === ','){		//这里要用 === ,不然会出现不想要的错误，比如无法识别0
			continue;
		}

		var num = !isNaN(curChar);
		if(num){
			result = result + curChar + ' ';
		}else if(curChar === '('){
			stack.push(curChar);
		}else if(curChar === ')'){
			var temp = stack.pop();
			while(temp != '('){
				//document.write(' '+temp);
				if(stack.length == 0)	return "false";
				result = result + temp + ' ';
				temp = stack.pop();

			}
		}else{	//只剩下curChar为运算符的情况
			if(privilege[stack[stack.length-1]] < privilege[curChar] || stack.length == 0){
				stack.push(curChar);
			}else{
				result = result + stack.pop() + ' ';
				while(privilege[stack[stack.length-1]] >= privilege[curChar] && stack.length > 0){
					result = result + stack.pop() + ' ';
				}
				stack.push(curChar);
			}
		}

	}
	while(stack.length != 0){
		result = result + stack.pop() + ' ';
	}
	return result
	}

//计算后缀表达式
function calculatePostFix(postFix){
		var stack = Array();
		var postfix = postFix.trim().split(' ');
		//document.write("  postfix:"+postfix);
		var result;
		for(var i = 0;i<postfix.length;i++){
			var curChar = postfix[i];
	
			var num = !isNaN(curChar);
			if(num){
				stack.push(Number(curChar));
			}else{
				switch (curChar){
					case '+':
						var first = stack.pop();
						var last = stack.pop();
						stack.push(last + first);
						
						break;
					case '-':
						var first = stack.pop();
						//当最后“多一个” - 时，其实这个不是减号，而是负号
						if(stack.length === 0){
							last = 0;
						}else{
							var last = stack.pop();
						}
						
						stack.push(last - first);
						break;
					case '*':
						var first = stack.pop();
						var last = stack.pop();
						stack.push(last * first);
						break;
					case '/': 	
						var first = stack.pop();
						var last = stack.pop();
						stack.push(last/first);
						break;
					case '%':
						var first = stack.pop();
						var last = stack.pop();
						stack.push(last%first);
						break;
					case '&':
						var first = stack.pop();
						var last = stack.pop();
						stack.push(last&&first);
						break;
					case '|':
						var first = stack.pop();
						var last = stack.pop();
						stack.push(last||first);
						break;
					case '~':
						var first = stack.pop();
						stack.push(!first);
						break;
					case '!':
						var first = stack.pop();
						stack.push(!first);
						break;
					case 's':
						var first = stack.pop();
						stack.push(Math.sin(first));
						break;
					case 'c':
						var first = stack.pop();
						stack.push(Math.cos(first));
						break;
					case 't':
						var first = stack.pop();
						stack.push(Math.tan(first));
						break;
					case 'a':
						var first = stack.pop();
						stack.push(Math.abs(first));
						break;
					case 'l':
						var first = stack.pop();
						stack.push(Math.log(first));
						break;
					case 'q':
						var first = stack.pop();
						stack.push(Math.sqrt(first));
						break;
					default:
						return "flase";
						
				}
			}
		}
		result = stack.pop();
		return result;
	}

//用于计算10的num次方
function pow(num){
	if(num === 0)	return 1;
	return pow(num - 1)*10;
}

//用于计算10的-num次方
function fpow(num){
	if(num === 0)	return 1;
	return fpow(num - 1)/10;
}

//用于检测输入，将单个的多位数转化成一个多位数，小数和负数的实现同理
function getExpression(express){
	var expression = express;
	var array = Array();
	var i = 0;
	//找出多位数和小数和负数，将其保存在一个区域
	for(;i<expression.length;i++){
		var curChar = expression[i];
		if(curChar === ' '){
			continue;
		}
	
		var num = !isNaN(curChar);
		if(num){
			var answer = 0;
			var flag = 0;
			var temp = Array();
			temp.push(Number(curChar));
			if(expression[i+1] === '.'){
				i++;
				flag = 1;
				temp.push('.');
			}
			if(i < expression.length-1){
	
				num = !isNaN(expression[i+1]);
			}else{
				num = false;
			}
			
			while(num){
			
				i++;
				temp.push(Number(expression[i]));
				if(expression[i+1] === '.'){
					i++;
					flag = 1;
					temp.push('.');
			  	}
				if(i > expression.length - 1){
					break;
				}
				//num = /^\d$/.test(expression[i+1]);
				num = !isNaN(expression[i+1]);
			}
			
			if(flag){
				for(var p=1;temp[p-1] !== '.';p++){

				}
				var llength = p-1;
				var rlength = temp.length - llength - 1;	//减去'.'所占的一个位置
				for(;rlength > 0; rlength--){
					answer = answer + temp.pop()*fpow(rlength);
				}
				temp.pop();	//将'.' pop出去
				for(var q = 0;llength > 0;llength--){
					answer = answer + temp.pop()*pow(q);
				}
				array.push(answer);
				//alert(answer);
			}else{
				for(var j =0;temp.length > 0;j++){		//temp.length会变，不能用于判断j！！浪费了我辣么多时间找bug！！
					answer = answer + (temp.pop()*pow(j));
				}
				array.push(answer);
				}
		
		}else if(curChar === '-' && expression[i-1] === '(' && expression[i+1] !== '('){	

			//检验负数

			var num = !isNaN(expression[i+1]);
			if(num){
				curChar = expression[i+1];
				i++;
				var answer = 0;
			var flag = 0;
			var temp = Array();
			temp.push(Number(curChar));
			if(expression[i+1] === '.'){
				i++;
				flag = 1;
				temp.push('.');
			}
			if(i < expression.length-1){
				num = /^\d$/.test(expression[i+1]);
			}else{
				num = false;
			}
			
			while(num){
				
				i++;
				temp.push(Number(expression[i]));
				if(expression[i+1] === '.'){
					i++;
					flag = 1;
					temp.push('.');
			  	}
				if(i > expression.length - 1){
					break;
				}
				num = /^\d$/.test(expression[i+1]);
			}
			
			if(flag){
				for(var p=1;temp[p-1] !== '.';p++){

				}
				var llength = p-1;
				var rlength = temp.length - llength - 1;	//减去'.'所占的一个位置
				for(;rlength > 0; rlength--){
					answer = answer + temp.pop()*fpow(rlength);
				}
				temp.pop();	//将'.' pop出去
				for(var q = 0;llength > 0;llength--){
					answer = answer + temp.pop()*pow(q);
				}
				answer = 0 - answer;
				array.push(answer);
				//alert(answer);
			}else{
				for(var j =0;temp.length > 0;j++){		//temp.length会变，不能用于判断j！！浪费了我辣么多时间找bug！！
					answer = answer + (temp.pop()*pow(j));
				}
				answer = 0 - answer;
				array.push(answer);
				}
			}

		}else{
			array.push(curChar);
		}
	}
	return array;
}

	

	function doIt(){
		var selected = $("#model option:selected") .val();
		//根据选择的不同模式选择对应的操作
		switch (selected){
			case '0':
				var exp = new Array();
				var flag = 0;
				exp = $("#exp").val().trim();
				if(exp.length === 0){
					//alert("请输入表达式！");
					document.getElementById("answer").innerHTML = "&nbsp &nbsp &nbsp &nbsp 请输入表达式！";
					$('#answer').slideDown();
				}else{
					//解决首括号的问题
					if(exp[0] === '-'){
						var l = '(';
						var r = ')';
						exp = l.concat(exp);
						exp = exp.concat(r);
					}
					exp = exp.replace(/sin/g,'s');
					exp = exp.replace(/cos/g,'c');
					exp = exp.replace(/tan/g,'t');
					exp = exp.replace(/abs/g,'a');
					exp = exp.replace(/ln/g,'l');
					exp = exp.replace(/log/g,'l');
					exp = exp.replace(/sqrt/g,'q');
					exp = exp.replace(/ /g,'');
					var express = getExpression(exp);
					var result = transInfix(express);
					var fin = calculatePostFix(result);
				
					if(isNaN(fin) || fin == undefined || result == "false" || fin == "false" ){
						document.getElementById("answer").innerHTML = "&nbsp &nbsp &nbsp &nbsp 输入错误，表达式无法解析！";
						$('#answer').slideDown();
					}else{
						document.getElementById("postFix").innerHTML = "&nbsp &nbsp &nbsp &nbsp 后缀表达式："+result;
						document.getElementById("answer").innerHTML = "&nbsp &nbsp &nbsp &nbsp 计算结果为："+fin;
						$('#postFix').slideDown();
						$('#answer').slideDown();
					}
					
				}
			break;
			case '1':
				var exp = $("#exp").val().trim();
				if(exp.length == 0){
					//alert("请输入表达式！");
					document.getElementById("answer").innerHTML = "&nbsp &nbsp &nbsp &nbsp 请输入表达式！";
					$('#answer').slideDown();
				}else{
					exp = exp.replace(/&&/g,'&');
					exp = exp.replace(/\|\|/g,'|');
					exp = exp.replace(/t/g,'1');
					exp = exp.replace(/T/g,'1');
					exp = exp.replace(/f/g,'0');
					exp = exp.replace(/F/g,'0');
					exp = exp.replace(/true/g,'1');
					exp = exp.replace(/TRUE/g,'1');
					exp = exp.replace(/false/g,'0');
					exp = exp.replace(/FALSE/g,'0');
					exp = exp.replace(/ /g,'');
					var express = getExpression(exp);
					var result = transInfix(express);
					var fin = calculatePostFix(result);
					if(isNaN(fin) || fin == undefined || fin == "false" || result == "false" ){
						//alert("表达式含有不能解析的字符！");
						document.getElementById("answer").innerHTML = "&nbsp &nbsp &nbsp &nbsp 表达式含有不能解析的字符！";
						$('#answer').slideDown();
					}else{
						/*document.getElementById("postFix").innerHTML = "&nbsp &nbsp &nbsp &nbsp 后缀表达式："+result;
						$('#postFix').slideDown();*/
						document.getElementById("answer").innerHTML = "&nbsp &nbsp &nbsp &nbsp 计算结果为："+Boolean(fin);
						$('#answer').slideDown();
					}
					
				}
			break;
			case '2':
				var exp = $("#exp").val().trim();
				var flag = 1;
				try{
					var fin = eval(exp);
				}catch(EvalError){
					//alert("不符合js语法规范！");
					document.getElementById("answer").innerHTML = "&nbsp &nbsp &nbsp &nbsp 不符合js语法规范！";
					$('#answer').slideDown();
					flag = 0;
				}
				if(flag){
					document.getElementById("answer").innerHTML = "&nbsp &nbsp &nbsp &nbsp 计算结果为："+ fin;
					$('#answer').slideDown();
				}
				
			break;
			default:
			break;
		}
		
	}

	

	