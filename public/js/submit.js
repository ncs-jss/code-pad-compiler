function loadSettings() {
    $('#name').val(localStorage.name);
    $('#adm_no').val(localStorage.adm_no);
}
function saveSettings() {
    localStorage.name = $('#name').val();
    localStorage.adm_no = $('#adm_no').val();
}
function getLang(lang){
  if(lang=='c'||lang=='cpp')
    return 'c_cpp';
  return lang;
}
$(document).ready(function(){
  $(window).on('beforeunload',function(){
      saveSettings();
    });
  loadSettings();
  var params=jQuery.deparam(window.location.search);
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/chrome");
  editor.session.setMode("ace/mode/"+getLang($("#lang option:selected").val()));
  jQuery('#lang').on('change',function(){
      editor.session.setMode("ace/mode/"+getLang($("#lang option:selected").val()));
    });
  jQuery('#code').on('submit',function(e){

      var jsonObj={
        code : editor.getValue(),
        lang : $("#lang option:selected").val(),
        ques_id : params.ques,
        name : $("#name").val(),
        admission_no:$("#adm_no").val()
      };
    console.log(jsonObj);
    e.preventDefault();
    $('#submit-button').addClass('is-loading');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        console.log(this.responseText);
        if(this.readyState == 4 && this.status == 200) {
          $('#submit-button').removeClass('is-loading');
          var result=JSON.parse(this.status);
          if(result.message == 'correct'){
            $('#notify').html('Correct');
            $('#notify').addClass('is-success animate-peek');
            $('#done-button').attr('class','button is-success'); 
          }
          if(result.message == 'wrong'){
            $('#notify').html('Incorrect');
            $('#notify').addClass('is-danger animate-peek'); 
          }
          setTimeout(()=>{
            $('#notify').attr('class','notification')
          },3500);
        }
        else if(this.readyState == 4 && this.status == 201){
          $('#submit-button').removeClass('is-loading');
          var result=JSON.parse(this.responseText);
            $('#notify').html(result.errorType);
            $('#notify').addClass('is-danger animate-peek'); 
          
          setTimeout(()=>{
            $('#notify').attr('class','notification')
          },3500); 
        }
      };
    xhttp.open("POST", window.location.origin+"/api/question/submit", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(jsonObj));
});
});
