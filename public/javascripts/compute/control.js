	$('#btn').click(doIt);

	$("#back_to_top").click(function(event){
		 $('html, body').animate({
                         scrollTop: $('#title').offset().top-200
         }, 500);
	})

	//当聚焦于输入框时，收起结果
	$("#exp").focusin(function(){
		$('#postFix').slideUp();
		$('#answer').slideUp();
		 document.getElementById("answer").setAttribute("class","row");
	})
	$("#exp").focusout(function(){
		$('#postFix').slideUp();
		$('#answer').slideUp();
	})

	$("#two").click(function(){
		$('#postFix').slideUp();
		$('#answer').slideUp();
		var number = $("#exp").val().trim();
		if(isNaN(number) || number == undefined || number==null || number.trim().length == 0){
			document.getElementById("answer").innerHTML = "&nbsp &nbsp &nbsp &nbsp 无法解析的输入";
			document.getElementById("answer").setAttribute("class","row box");
			$('#answer').slideDown();
		}else{
			var output = Number(number).toString(2);
			document.getElementById("answer").innerHTML ="&nbsp &nbsp &nbsp &nbsp "+ number+"  二进制表示为："+ output;
			document.getElementById("answer").setAttribute("class","row box");
			$('#answer').slideDown();
		}
	})
	$("#o").click(function(){
		$('#postFix').slideUp();
		$('#answer').slideUp();
		var number = $("#exp").val().trim();
		if(isNaN(number) || number == undefined || number==null || number.trim().length == 0){
			document.getElementById("answer").innerHTML = "&nbsp &nbsp &nbsp &nbsp 无法解析的输入";
			document.getElementById("answer").setAttribute("class","row box");
			$('#answer').slideDown();
		}else{
			var output = Number(number).toString(8);
			document.getElementById("answer").innerHTML = "&nbsp &nbsp &nbsp &nbsp "+ number+"  八进制表示为："+ output;
			document.getElementById("answer").setAttribute("class","row box");
			$('#answer').slideDown();
		}
	})
	$("#0x").click(function(){
		$('#postFix').slideUp();
		$('#answer').slideUp();
		var number = $("#exp").val().trim();
		if(isNaN(number) || number == undefined || number==null || number.trim().length == 0){
			document.getElementById("answer").innerHTML = "&nbsp &nbsp &nbsp &nbsp 无法解析的输入";
			document.getElementById("answer").setAttribute("class","row box");
			$('#answer').slideDown();
		}else{
			var output = Number(number).toString(16);
			document.getElementById("answer").innerHTML ="&nbsp &nbsp &nbsp &nbsp "+  number+"  十六进制表示为："+ output;
			document.getElementById("answer").setAttribute("class","row box"); 
			$('#answer').slideDown();
		}
	})