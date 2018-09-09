$(document).ready(function(e){
  console.log(localStorage.getItem('x-auth'));
  if(localStorage.getItem('x-auth')===null){
    window.location.href="/admin";
  }
  else{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      console.log(data);
      data.map(function(item){
        $("#table_body").append('<tr><th>'+item.name+'</th><th>'+item.admission_no+'</th><th>'+item.questions_solved+'</th></tr>');
      })
    }
  };
  xhttp.open("GET", window.location.origin+"/api/user/leaderboard", true);
  xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
  xhttp.send();
  }
});
