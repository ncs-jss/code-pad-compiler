jQuery('#login-form').on('submit',function(e){
e.preventDefault();
 var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      var x_auth = xhttp.getResponseHeader('x-auth');
      localStorage.setItem('x-auth',x_auth);
      window.location.href='/addquestion';
    }
  };
  xhttp.open("POST", window.location.origin+"/api/user/login", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  var jsonObj={
  	username : jQuery("#username").val(),
  	password : jQuery("#password").val()
  };
  xhttp.send(JSON.stringify(jsonObj));
});