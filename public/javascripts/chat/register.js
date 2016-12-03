$(document).ready(function(){
	$('.userIdForm').on('submit',function(evt){
		console.log("submit happened!");
		//evt.preventDefault();	//防止提交事件发生
		var action = $(this).attr('action');
		var container = $(this).closest('.idFormContainer');
		var length = $('.userId').val().trim().length;

		if(length > 10){
			evt.preventDefault();	//防止提交事件发生
			$('#id_long').slideDown();
		}

	})

	$('.userId').focusin(function(){
		$('#id_long').slideUp();
	})

})