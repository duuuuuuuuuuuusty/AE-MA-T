$(function(){function e(){$(".aw-row input").attr("style","background:white;"),$(".aw-row:visible:even input").attr("style","background:#e1feff;")}function t(e){if(!e.ok)throw Error(e.statusText);return e}const a=document.getElementById("aw-console");function n(){$("#aw-m-t-dumpzone img").trigger("click"),$("#aw-m-create-wrap input, #aw-m-create-wrap textarea").val(""),$("#aw-m-create-wrap input, #aw-m-create-wrap span").show(),a.textContent="Fields cleared\n"+a.textContent}function l(e){var t=JSON.parse(e);$("#aw-m-cell-name").val(t.name),$("#aw-m-cell-img").val(t.img),$("#aw-m-cell-issuer").val(t.issuer),$("#aw-m-cell-desc").val(t.desc),"1"===t.visible?(document.getElementById("aw-m-cell-visible").checked=!0,$("#aw-m-cell-visible").val("1")):(document.getElementById("aw-m-cell-visible").checked=!1,$("#aw-m-cell-visible").val("0"))}function i(e){return $("<img>").attr({src:e.img,title:e.desc,tid:$("#aw-m-saved-wrap img").length+1,name:e.name,class:"aw-s-img","m-info":JSON.stringify(e)})}$(".aw-label.awe").click(function(){e()}),$("#aw-login").click(function(){fetch("/admin.php?login=yes&username="+encodeURIComponent($("#aw-login-usn").val())+"&password="+encodeURIComponent($("#aw-login-pw").val())).then(function(e){-1!=e.url.indexOf("adsess")&&e.url.substring(e.url.indexOf("adsess=")+7).length>0?(token=e.url.substring(e.url.indexOf("adsess=")+7),e.text().then(function(e){let t=$(e).filter("title").text();fName=t.substring(0,t.indexOf("->")).replace(/\s/g,"").toLowerCase()}),a.textContent="ACP Token Found\n"+a.textContent,$("#aw-ae-build-table").css("display","unset")):a.textContent="Login failed\n"+a.textContent})}),$("#aw-ae-build-table").click(function(){$(this).hide(),fetch("/admin.php?act=mysql&adsess="+token+"&code=dump&line=0&part=8").then(fetch("/admin.php?act=mysql&adsess="+token+"&code=dump&line=0&part=37")).then(t).then(e=>a.textContent="Logging in and going to sleep (5s)\n"+a.textContent).catch(e=>console.log(e)),(e=>new Promise(t=>setTimeout(t,e)))(5e3).then(()=>{fetch("/boardservice/sqls/"+token+"-"+fName+"_.sql").then(function(e){return e.text()}).then(function(n){let l=$("<div>").text(n).html().split(/\n/g),i=[],s=[];l.filter(function(e){e.indexOf("_members` VALUES (")>0?s.push(e):e.indexOf("_awards` VALUES (")>0&&i.push(e)});const o=new Array(s.length+1);s.map(e=>{var t=e.substring(e.indexOf("(")+1,e.indexOf('", ')).split(', "');o.splice(parseInt(t[0]),0,t[1])});const c={};for(var r=0;r<o.length;r++)c[o[r]]=r;c[void 0]="";const d=[];i.map(e=>{let t={},n=e.substring(e.indexOf("(")+1,e.indexOf(")")).replace(/\"/g,"").split(", ");if(n.length>7){console.log("Re-passing faulty array with complex regex\n",n),n=e.substring(e.indexOf("(")+1,e.lastIndexOf(")")).match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);for(var l=2;l<n.length-1;l++)n[l]=n[l].slice(1,-1);console.log("Post-process: ",n),a.textContent="Award #"+n[0]+" contains one or more un-escaped commas (,) in its data. This may cause instability.\n"+a.textContent}t.ID=n[0],t.user=n[1],t.name=n[2],t.img=n[3],t.issuer=n[4],t.desc=n[5],t.visible=n[6],d.push(t)}),console.log(o),console.log(c),console.log(d);for(r=0;r<d.length;r++){let t=document.getElementById("aw-edit").children[1].insertRow(0);for(var[m,u]of(t.id="aw-edit-row-"+r,t.setAttribute("rowNum",d[r].ID),t.className="aw-row",Object.entries(d[r]))){let e=t.insertCell(-1);switch(e.className="aw-"+`${m}`,`${m}`){case"ID":e.innerHTML="<input type='text' class='cell-ID' default='"+`${u}`+"' value='"+`${u}`+"' readonly>";break;case"user":e.innerHTML="<input type='text' class='cell-user' default='"+`${u}`+"' value='"+o[`${u}`]+"'>";break;case"visible":e.innerHTML="<select class='cell-visible' default='"+`${u}`+"'><option value='0'>No</option><option value='1'>Yes</option></select>",e.children[0].children[`${u}`].setAttribute("selected","true");break;default:e.innerHTML="<input type='text' class='cell-"+`${m}`+"' default='"+`${u}`+"' value='"+`${u}`+"'>"}}let a=t.insertCell(-1);a.innerHTML="<div class='aw-delete'>✗</div>",a.className="cell-delete",e()}function w(e){let n=$(e);var l=n.find(".cell-ID").val(),i=c[n.find(".cell-user").val()]+"",s=n.find(".cell-name").val(),o=n.find(".cell-img").val(),r=n.find(".cell-issuer").val(),d=n.find(".cell-desc").val(),m=n.find(".cell-visible").val(),u="/admin.php?"+$.param({adsess:token,code:"do_awardsedit",act:"awards",id:l,mid:i,name:s,image:o,givenby:r,description:d,display:m});fetch(u).then(t).then(e=>e.text()).then(t=>{let n=(new DOMParser).parseFromString(t,"text/html");"Please enter a valid award id."===$(n).find(".tdrow1").text().trim()?a.textContent="Award ID#"+l+" not found - Has it already been deleted?\n"+a.textContent:"The action was executed successfully"===$(n).find("#description").text().trim()&&(a.textContent="#"+l+" - The action was executed successfully\n"+a.textContent,$(e).find(".cell-user").attr("default",i),$(e).find(".cell-name").attr("default",s),$(e).find(".cell-img").attr("default",o),$(e).find(".cell-issuer").attr("default",r),$(e).find(".cell-desc").attr("default",d))}).catch(function(e){console.log(e),a.textContent="An error has occurred: Please see the console for details\n"+a.textContent}),$(e).removeClass("aw-marked-for-upload"),$(e).find(".aw-controls-wrap").remove()}$(".cell-user, .cell-name, .cell-img, .cell-issuer, .cell-desc, .cell-visible").focusout(function(){let e=$(this).parents("tr").eq(0),t=[],n=[];e.find("input, select").each(function(e){switch(t.push($(this).attr("default")),e){case 1:n.push(c[$(this).val()]+"");break;default:n.push($(this).val())}}),t.length===n.length&&t.every((e,t)=>e===n[t])?(console.log("arrays matched"),console.log(t,n),e.hasClass("aw-marked-for-upload")&&(e.removeClass(),e.find(".aw-controls-wrap").remove(),a.textContent="Row #"+e.attr("rownum")+" has been reset\n"+a.textContent)):(console.log("arrays do not match"),console.log(t,n),e.hasClass("aw-marked-for-upload")||(e.addClass("aw-marked-for-upload"),e.append($('<div class="aw-controls-wrap"><span class="aw-controls-confirm">☑</span> <span class="aw-controls-cancel">☒</span></div>')),a.textContent="Row #"+e.attr("rownum")+" has been altered\n"+a.textContent))}),$(document).on("click",".aw-controls-cancel",function(){let e=$(this).parents("tr").eq(0);e.find("input, select").each(function(e){switch(e){case 1:$(this).val(o[$(this).attr("default")]),o[$(this).attr("default")]||$(this).val("undefined");break;default:$(this).val($(this).attr("default"))}}),e.removeClass("aw-marked-for-upload"),e.find(".aw-controls-wrap").remove(),a.textContent="Row #"+e.attr("rownum")+" has been reset\n"+a.textContent}),$(document).on("click",".aw-delete",function(){$(this).parents("tr").eq(0).toggleClass("aw-marked-for-deletion")}),$("#aw-search").click(function(){$(".aw-hidden").removeClass("aw-hidden");let t=$("#aw-search-type").val(),a=$("#aw-search-phrase").val();$(".cell-"+t+":not(.cell-"+t+'[value="'+a+'"])').parentsUntil($("#aw-edit"),".aw-row").addClass("aw-hidden"),e()}),$("#clearsort").click(function(){$(".aw-hidden").removeClass("aw-hidden"),e()}),$("#aw-replace").click(function(){let e=$("#aw-replace-type").val(),t=$("#aw-replace-original").val(),a=$("#aw-replace-new").val();$(".cell-"+e+'[value="'+t+'"]').val(a).trigger("focusout")}),$("#aw-remove-selected").click(function(){console.log("Deleting awards.."),$.each($(".aw-marked-for-deletion"),function(){var e=$(this).find(".cell-ID").val();fetch("/admin.php?act=mysql&adsess="+token+"&act=awards&code=awardsdelete&id="+e).then(t).then(e=>e.text()).then(t=>{let n=(new DOMParser).parseFromString(t,"text/html");"Please enter a valid award id."===$(n).find(".tdrow1").text().trim()?a.textContent="#"+e+" not found - Has it already been deleted?\n"+a.textContent:"The action was executed successfully"===$(n).find("#description").text().trim()&&(a.textContent="#"+e+" - The action was executed successfully\n"+a.textContent)}).catch(function(e){console.log(e),a.textContent="An error has occurred: Please see the console for details\n"+a.textContent}),$(this).addClass("aw-deleted").removeClass("aw-marked-for-deletion")})}),$("#aw-upload-selected").click(function(){console.log("Submitting awards.."),$.each($(".aw-marked-for-upload"),function(){w(this)})}),$("#aw-discard-changes").click(function(){$(".aw-controls-cancel").trigger("click")}),$(document).on("click",".aw-controls-confirm",function(){w($(this).parents("tr").eq(0))})})})}),$("#aw-m-reset").click(function(){n()}),$(document).on("click","#aw-m-template-container .aw-s-img",function(){let e=$(this).clone();($(this).toggleClass("aw-selected"),$('#aw-m-t-dumpzone img[tid="'+e.attr("tid")+'"]').length>0)?$('#aw-m-t-dumpzone img[tid="'+e.attr("tid")+'"]').remove():($("#aw-m-t-dumpzone").append(e),l(e.attr("m-info")),$("#aw-m-t-dumpzone img").length>1&&($("#aw-m-create-wrap input, #aw-m-create-wrap span").hide(),$("#aw-m-submit").attr("aw-type","template")))}),$(document).on("click","#aw-m-t-dumpzone img",function(){($('#aw-m-template-container .aw-s-img[tid="'+$(this).attr("tid")+'"]').toggleClass("aw-selected"),$(this).remove(),1===$("#aw-m-t-dumpzone img").length)&&($("#aw-m-create-wrap input, #aw-m-create-wrap span").show(),$("#aw-m-submit").attr("aw-type","regular"),l($("#aw-m-t-dumpzone img").attr("m-info")))}),$("#aw-m-save").click(function(){let e={};$("#aw-m-create-wrap input").each(function(){e[$(this).attr("m-type")]=$(this).val()}),$("#aw-m-template-container").append(i(e))}),$("#aw-m-template-load").click(function(){confirm("This will overwrite all currently loaded templates")&&fetch("/index.php?act=UserCP&CODE=01").then(t).then(e=>e.text()).then(e=>{let t=(new DOMParser).parseFromString(e,"text/html"),a=$(t).find('form[name="theForm"]').serializeArray();window.dataMkAvail={},$.each(a,function(e,t){dataMkAvail[t.name]=t.value});let n=dataMkAvail.field_19.split("\n");$("#aw-m-template-container").empty(),console.log(n),$.each(n,function(){let e=JSON.parse(this);console.log(e),$("#aw-m-template-container").append(i(e))})}).catch(function(e){console.log(e),a.textContent="A connection error has occurred: Please see the console for details\n"+a.textContent}),n()}),$("#aw-m-template-delete").click(function(){if($.each($(".aw-selected"),function(){$('.aw-s-img[tid="'+$(this).attr("tid")+'"]').remove()}),$("#aw-m-t-dumpzone img").length<=1){if($("#aw-m-create-wrap input, #aw-m-create-wrap span").show(),$("#aw-m-submit").attr("aw-type","regular"),n(),1===$("#aw-m-t-dumpzone img"))l($("#aw-m-t-dumpzone img").attr("m-info"));$("#aw-m-create-wrap input, #aw-m-create-wrap span").show()}}),$("#aw-m-t-s-sel, #aw-m-t-s-all").click(function(){let e=$(this).attr("id");"aw-m-t-s-sel"===e?$.each($(".aw-selected"),function(){console.log("sel"),dataMkAvail.field_19=dataMkAvail.field_19+"\n"+$(this).attr("m-info")}):"aw-m-t-s-all"===e&&(dataMkAvail.field_19="",$.each($("#aw-m-template-container .aw-s-img"),function(){console.log("all"),dataMkAvail.field_19=dataMkAvail.field_19+"\n"+$(this).attr("m-info")}));let n=new FormData;for(var l in n.append("auth_key","\x3c!-- |auth_key| --\x3e"),dataMkAvail)n.append(l,dataMkAvail[l]);fetch("/index.php?",{method:"POST",body:n}).then(t).then(e=>e.text()).then(e=>{let t=(new DOMParser).parseFromString(e,"text/html");$(t).find("#redirect-screen")?a.textContent="Templates updated\n"+a.textContent:$(t).find("#board-message")&&(a.textContent="Templates failed to update\n"+a.textContent)}).catch(function(e){console.log(e),a.textContent="A connection error has occurred: Please see the console for details\n"+a.textContent})}),$("#aw-m-cell-visible").on("change",function(){this.value=this.checked?1:0}).change(),$("#aw-m-submit").click(function(){var e=$("#aw-m-cell-user").val().split(/\n/g);function n(e,n){fetch(e,n).then(t).then(e=>e.text()).then(e=>{let t=(new DOMParser).parseFromString(e,"text/html");"Please fill out the form completely."===$(t).find(".tdrow1").text().trim()?a.textContent="Submission failed ("+n+") - Please fill out the form completely\n"+a.textContent:$(t).find("#description")&&(a.textContent="("+n+") - The action was executed successfully\n"+a.textContent)}).catch(function(e){console.log(e),a.textContent="A connection error has occurred: Please see the console for details\n"+a.textContent})}$.each(e,function(){if("regular"===$("#aw-m-submit").attr("aw-type")){console.log("type 1");var e="/admin.php?"+$.param({adsess:token,code:"awardsadd",act:"awards",username:this,name:$("#aw-m-cell-name").val(),image:$("#aw-m-cell-img").val(),givenby:$("#aw-m-cell-issuer").val(),description:$("#aw-m-cell-desc").val(),display:$("#aw-m-cell-visible").val()});uName=this,n(e,uName)}else if("template"===$("#aw-m-submit").attr("aw-type")){console.log("type 2");for(var t=$("#aw-m-t-dumpzone img"),a=0;a<t.length;a++){var l=JSON.parse(t.eq(a).attr("m-info"));e="/admin.php?"+$.param({adsess:token,code:"awardsadd",act:"awards",username:this,name:l.name,image:l.img,givenby:l.issuer,description:l.desc,display:l.visible});uName=this,n(e,uName)}}})})});
