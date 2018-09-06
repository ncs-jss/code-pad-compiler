$(document).ready(function(){
    getQuestion($("#day option:selected").text());
    jQuery('#day').on('change',function(){
      getQuestion($("#day option:selected").text());
    });
});

function getQuestion(day){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var result=JSON.parse(this.responseText);
      console.log(this.responseText);
      jQuery('#ques-list').empty();
      result.forEach(function(ques){
          var template = jQuery('#ques-template').html();
        
          var html = Mustache.render(template,{
            question : ques.question,
            input : ques.input[0],
            output : ques.output[0],
            ques_id:ques._id
           });
          jQuery('#ques-list').append(html);
          // if(user.followers.indexOf(localStorage.getItem('_id'))>=0)
          // {
          //   jQuery('#'+user._id+"-follow").html('Unfollow');  
          // }
          jQuery('#'+ques._id).click(function(){
            window.location.href='/submit.html?ques='+ques._id;
          });
      });
    }
    else if(this.readyState == 4 && this.status == 404){
      alert('Event Not Found');
      window.location.href="/";
    }
  };
  xhttp.open("GET", window.location.origin+"/api/question/day/"+day, true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.send();

} 