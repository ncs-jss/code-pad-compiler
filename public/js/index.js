function loadSettings() {
    sessionStorage.tabs=sessionStorage.tabs||1;
    sessionStorage.tabData=sessionStorage.tabData||JSON.stringify({});
    if(!sessionStorage.currentTab){
      sessionStorage.currentTab='tab-1';
      resetTab();
      saveCurrentTabData();
    }
    restoreTab();
    $(`#${sessionStorage.currentTab}`).addClass("active");
}
function saveSettings() {
  console.log("test");
    saveCurrentTabData();
}
function getLang(lang){
  if(lang=='c'||lang=='cpp')
    return 'c_cpp';
  return lang;
}
function restoreTab(){
  const tabData = JSON.parse(sessionStorage.tabData);
  Object.keys(tabData).forEach(key=>{
    const tabHTML = `<li class="" id="${key}"><a style="display:inline-flex;"data-toggle="tab"><span>IDE</span><button id="close-${key}" class="close" onclick="event.stopPropogation()" type="button" >×</button></a></li>` 
    $( tabHTML ).insertBefore( $( "#add-button" ) );
    var editor = ace.edit("editor");
    $(`#${key}`).on('click',function(e){
      if(this.id!='add-button'&&this.id!=sessionStorage.currentTab)
      {
        saveCurrentTabData();
        sessionStorage.currentTab=this.id;
        setCurrentTabData();  
      }
    });

    $(`#close-${key}`).on('click',function(){
      // e.stopPropogation();
      const tab=this.id.substring(this.id.indexOf('-')+1);
      let currentTab = sessionStorage.currentTab;
      const tabData=JSON.parse(sessionStorage.tabData);
      let tabs = Object.keys(tabData);
      $(`#${tab}`).remove();
      delete tabData[tab];
      sessionStorage.tabData=JSON.stringify(tabData);
      if(currentTab===tab){
        if(tabs.length===1){
          sessionStorage.clear();
          loadSettings();
        }
        else if(tabs.indexOf(tab)===0){
          sessionStorage.currentTab=tabs[tabs.indexOf(tab)+1];
        }
        else{
          sessionStorage.currentTab=tabs[tabs.indexOf(tab)-1];
        }
      }
    });
  })
  setCurrentTabData();
}
function addTabInList(){
  const tabs = parseInt(sessionStorage.tabs||1);
  const key =`tab-${tabs+1}`;
  console.log(key);
  const tabHTML = `<li class="active" id="${key}"><a style="display:inline-flex;"data-toggle="tab"><span>IDE</span><button id="close-${key}" class="close" type="button" onclick="event.stopPropogation()">×</button></a></li>` 
  $( tabHTML ).insertBefore( $( "#add-button" ) );
  sessionStorage.tabs=tabs+1;
  saveCurrentTabData();
  sessionStorage.currentTab=key;
  resetTab();
  $(`#${key}`).on('click',function(e){
    if(this.id!='add-button'&&this.id!=sessionStorage.currentTab)
      {
        saveCurrentTabData();
        sessionStorage.currentTab=this.id;
        setCurrentTabData();  
      }
    
  });
  $(`#close-${key}`).on('click',function(){
      const tab=this.id.substring(this.id.indexOf('-')+1);
      console.log(tab)
      let currentTab = sessionStorage.currentTab;
      let tabData=JSON.parse(sessionStorage.tabData);
      let tabs = Object.keys(tabData);
      $(`#${tab}`).remove();
      delete tabData[tab];
      sessionStorage.tabData=JSON.stringify(tabData);
      if(currentTab===tab){
        if(tabs.length===1){
          sessionStorage.clear();
          loadSettings();
        }
        else if(tabs.indexOf(tab)===0){
          sessionStorage.currentTab=tabs[tabs.indexOf(tab)+1];
          setCurrentTabData();
        }
        else{
          sessionStorage.currentTab=tabs[tabs.indexOf(tab)-1];
          setCurrentTabData();
        }
      }
    });
}
function resetTab(){
  var editor = ace.edit("editor");
  editor.setValue('');
  $("#lang").val('c').change();
  editor.session.setMode("ace/mode/c_cpp");
  $("#input").val('')
  $("#output").val('')
  const currentTab = sessionStorage.currentTab;
  const tabData = JSON.parse(sessionStorage.tabData);
  var editor = ace.edit("editor");
  var data={
    code:editor.getValue(),
    lang:$("#lang option:selected").val(),
    input:$("#input").val(),
    output:$("#input").val()
  }
  tabData[`${currentTab}`]=data;
  sessionStorage.tabData=JSON.stringify(tabData);
}
function saveCurrentTabData(){
  const currentTab = sessionStorage.currentTab;
  const tabData = JSON.parse(sessionStorage.tabData);
  var editor = ace.edit("editor");
  var data={
    code:editor.getValue(),
    lang:$("#lang option:selected").val(),
    input:$("#input").val(),
    output:$("#input").val()
  }
  tabData[`${currentTab}`]=data;
  sessionStorage.tabData=JSON.stringify(tabData);
  $(`#${currentTab}`).removeClass("active");
}

function setCurrentTabData(){
  const currentTab = sessionStorage.currentTab;
  const tabData = JSON.parse(sessionStorage.tabData);
  var editor = ace.edit("editor");
  console.log(tabData);
  editor.setValue(tabData[currentTab].code);
  $("#lang").val(tabData[currentTab].lang).change();
  editor.session.setMode("ace/mode/"+getLang(tabData[currentTab].lang));
  $("#input").val(tabData[currentTab].input)
  $("#output").val(tabData[currentTab].output)
  $(`#${currentTab}`).addClass("active");
}

$(document).ready(function(){
  $(window).on('beforeunload',function(){
      console.log("test");
      saveSettings();
    });
  loadSettings();
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/chrome");
  editor.session.setMode("ace/mode/"+getLang($("#lang option:selected").val()));
  jQuery('#lang').on('change',function(){
      editor.session.setMode("ace/mode/"+getLang($("#lang option:selected").val()));
    });
  jQuery('#add-tab-button').on('click',function(e){
    addTabInList();

  });
  jQuery('#code').on('submit',function(e){
      e.preventDefault();
      var jsonObj={
        code : editor.getValue(),
        lang : $("#lang option:selected").val(),
        input : $("#input").val()
      };
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
