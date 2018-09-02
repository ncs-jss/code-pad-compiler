$(document).ready(function(){
    var params=jQuery.deparam(window.location.search);

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/"+getLang($("#lang option:selected").val()));

    jQuery('#lang').on('change',function(){
      editor.session.setMode("ace/mode/"+getLang($("#lang option:selected").val()));
    });


    jQuery('#code').on('submit',function(e){
    e.preventDefault();
     var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          
          var result=JSON.parse(this.responseText);
          console.log(result);
          $('#code-result').val(result.message+" answer");
        }
      };
      xhttp.open("POST", "http://localhost:8000/api/question/submit", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      var jsonObj={
        code : editor.getValue(),
        lang : $("#lang option:selected").val(),
        ques_id : params.ques,
        name : $("#name").val(),
        admission_no:$("#adm_no").val()

      };
      xhttp.send(JSON.stringify(jsonObj));
    });
});

function getLang(lang){
  console.log(lang);
  if(lang=='c'||lang=='cpp'){
    return 'c_cpp';
  }
  return lang;
} 