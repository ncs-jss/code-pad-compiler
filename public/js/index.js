function loadSettings() {
    var editor = ace.edit("editor");
    $("#lang").val(localStorage.lang).change();
    editor.setValue(localStorage.code);
    // editor.session.setMode("ace/mode/"+getLang($("#lang option:selected").val()));
}
function saveSettings() {
    var editor = ace.edit("editor");
    localStorage.code = editor.getValue();
    localStorage.lang = $("#lang option:selected").val();
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
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/chrome");
  editor.session.setMode("ace/mode/"+getLang($("#lang option:selected").val()));
  jQuery('#lang').on('change',function(){
      editor.session.setMode("ace/mode/"+getLang($("#lang option:selected").val()));
    });
  jQuery('#run-button').on('click',function(e){

      var jsonObj={
        code : editor.getValue(),
        lang : $("#lang option:selected").val(),
        input : $("#input").val()
      };
    e.preventDefault();
    $('#run-button').addClass('is-loading');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
          $('#run-button').removeClass('is-loading');
          var result=JSON.parse(this.responseText);
          $('#output').val(result.output);
          setTimeout(()=>{
            $('#notify').attr('class','notification')
          },3500);
        }
        else if(this.readyState == 4 && this.status == 201){
          $('#run-button').removeClass('is-loading');
          var result=JSON.parse(this.responseText);
            $('#notify').html('Error: '+result.errorType);
            $('#notify').addClass('is-danger animate-peek');
            $('#output').val(result.error);
          setTimeout(()=>{
            $('#notify').attr('class','notification')
          },3500); 
        }
  else if(this.readyState == 4 && this.status==400){
    $('#run-button').removeClass('is-loading');
    $('#notify').html('Error');
    $('#notify').addClass('is-danger animate-peek');
    setTimeout(()=>{
      $('#notify').attr('class','notification')
    },3500);
  }
      };
    xhttp.open("POST", window.location.origin+"/api/question/run", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(jsonObj));
});




});
