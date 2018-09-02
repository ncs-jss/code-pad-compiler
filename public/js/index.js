$(document).ready(function(){
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/c_cpp");
    jQuery('#code').on('submit',function(e){
    e.preventDefault();
     var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          
          var result=JSON.parse(this.responseText);
          console.log(result);
          $('#code-result').val(result.stdout);
        }
      };
      xhttp.open("POST", "http://localhost:8000/api/compile", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      // xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
      var jsonObj={
        code : editor.getValue(),
        lang : $("#code-lang").val()
      };
      xhttp.send(JSON.stringify(jsonObj));
    });
}); 