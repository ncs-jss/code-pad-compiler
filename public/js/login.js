$(document).ready(function(){
	$('#login_button').on('click',function(e){
		var username = $('#username_input').val();
		var password = $('#password_input').val();
		$.post("/api/user/leaderboard",
		    {
		         username:username,
		         password:password
		    },
		    function(data, status){
		       console.log(status);
		    });
			})	
})
