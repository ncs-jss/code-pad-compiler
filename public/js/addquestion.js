$(document).ready(function(){
  console.log(localStorage.getItem('x-auth'));
  if(localStorage.getItem('x-auth')===null){
    window.location.href="/admin";
  }
  else{
    var input=new Array();
    var output=new Array();
    $('#test_case').on('click',function(){
        input.push($('#input').val());
        output.push($('#output').val());
        alert("Added");
    });
    $('#add_question').on('click',function(){
      addQuestion($('#question').val(),input,output,$('#day').val());
    });
  }
});

function addQuestion(question,input,output,day){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var result=JSON.parse(this.responseText);
      console.log(result);
      alert("Added Question");
    }
    else if(this.readyState == 4 && this.status == 401){
      alert('Unauthorised');
      window.location.href="/";
    }
  };

  var json={
    question: question,
    input:input,
    output:output,
    day:day
  }; 
  console.log(json);
  xhttp.open("POST", window.location.origin+"/api/question/add", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
  xhttp.send(JSON.stringify(json));
}
