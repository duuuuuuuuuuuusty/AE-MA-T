/* Award Editor version like.. -.09. Support Thread: http://forum.jcink.com/index.php?showtopic=27980 */
// If you're reading past this line I'm sorry for the disgust that this script will prompt from you

//.. sorta
$(function() {
  let auth_key = '<!-- |auth_key| -->';
  let ucpField = 'field_19';

  // Editor visuals
  function refreshRow() {
    $('.aw-row input').attr('style', 'background:white;')
    $('.aw-row:visible:even input').attr('style', 'background:#e1feff;')
  }
  //
  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  const awCon = document.getElementById('aw-console')
  
  $('.aw-label.awe').click(function() {
    refreshRow()
  })
  $('#aw-login').click(function() {
    fetch("/admin.php?login=yes&username=" + $('#aw-login-usn').val() + "&password=" + $('#aw-login-pw').val()).then(function(response) {
      if (((response.url).substring((response.url).indexOf('adsess=') + 7)).length > 0) {
        token = (response.url).substring((response.url).indexOf('adsess=') + 7)
        response.text().then(function(data) {
          let a = $(data).filter('title').text();
          fName = a.substring(0, a.indexOf('->')).trim().toLowerCase()
        });
        awCon.textContent = 'ACP Token Found\n' + awCon.textContent
        $('#aw-ae-build-table').css('display', 'unset')
      } else {
        awCon.textContent = 'Login failed\n' + awCon.textContent
      }
    })
  });
  // Request chains for the specific tables needed.
  $('#aw-ae-build-table').click(function() {
    $(this).hide();
    fetch("/admin.php?act=mysql&adsess=" + token + "&code=dump&line=0&part=8")
      .then(fetch("/admin.php?act=mysql&adsess=" + token + "&code=dump&line=0&part=37"))
      .then(handleErrors)
      .then(response => awCon.textContent = 'Logging in and going to sleep (5s)\n' + awCon.textContent)
      .catch(error => console.log(error))
    sleep(5000).then(() => {
      fetch('/boardservice/sqls/' + token + '-' + fName + '_.sql')
        .then(function(response) {
          return response.text()
        }).then(function(data) {
          // Split entries between awards and members. Not sure if these can be intermingled in the database file, but if they can we should handle it
          let rawArray = $('<\div>').text(data).html().split(/\n/g), // This isn't XSS safe, but there shouldn't be any real risk
            awardArray = [],
            memberArray = [],
            memberSearchStr = '_members` VALUES (',
            awardSearchStr = '_awards` VALUES (';

          // Split array entries between member entries and award entries
          rawArray.filter(function(x) {
            if (x.indexOf(memberSearchStr) > 0) {
              memberArray.push(x)
            } else if (x.indexOf(awardSearchStr) > 0) {
              awardArray.push(x)
            }
          })

          // Create a indexed user array
          const userMap = new Array(memberArray.length + 1); // I know, right? trust me, it makes sense. +1 to accomodate zero base array
          memberArray.map(user => {
            var arr = user.substring((user.indexOf('(') + 1), (user.indexOf('\", '))).split(', "');
            userMap.splice(parseInt(arr[0]), 0, arr[1])
          })

          // Create a searchable member ID object
          const inverseUserMap = {};
          for (var i = 0; i < userMap.length; i++) {
            inverseUserMap[userMap[i]] = i;
          }
          inverseUserMap['undefined'] = '';

          // Create an array of award data
          const awardMap = []; // since this isn't a matched array, we don't need a specific number of indices
          awardArray.map(award => {
            let aObj = {},
              arr = award.substring(award.indexOf('(') + 1, award.indexOf(')')).replace(/\"/g, '').split(', ');

            if (arr.length > 7) { // This sanitizes errant commas in case they meSS WITH MY DAMN SPLITTIN
              console.log('Re-passing faulty array with complex regex\n', arr)
              arr = award.substring(award.indexOf('(') + 1, award.lastIndexOf(')')).match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
              for (var i = 2; i < arr.length - 1; i++) {
                arr[i] = arr[i].slice(1, -1) // These strings will still have the quotation marks from the table
              }
              console.log('Post-process: ', arr);
              awCon.textContent = 'Award #' + arr[0] + ' contains one or more un-escaped commas (,) in its data. This may cause instability.\n' + awCon.textContent
            }

            aObj.ID = arr[0],
              aObj.user = arr[1],
              aObj.name = arr[2],
              aObj.img = arr[3],
              aObj.issuer = arr[4],
              aObj.desc = arr[5],
              aObj.visible = arr[6];

            awardMap.push(aObj)
          })

          console.log(userMap)
          console.log(inverseUserMap)
          console.log(awardMap)



          // now the big kahuna, build the HTML table
          for (var i = 0; i < awardMap.length; i++) {
            let row = document.getElementById('aw-edit').children[1].insertRow(0);
            row.id = 'aw-edit-row-' + i
            row.setAttribute('rowNum', (awardMap[i]['ID']))
            row.className = 'aw-row'
            for (var [key, value] of Object.entries(awardMap[i])) {
              let newTd = row.insertCell(-1);
              newTd.className = 'aw-' + `${key}`;
              switch (`${key}`) {
                case 'ID':
                  newTd.innerHTML = "<input type='text' class='cell-ID' default='" + `${value}` + "' value='" + `${value}` + "' readonly>";
                  break;
                case 'user':
                  newTd.innerHTML = "<input type='text' class='cell-user' default='" + `${value}` + "' value='" + userMap[`${value}`] + "'>";
                  break;
                case 'visible':
                  newTd.innerHTML = "<select class='cell-visible' default='" + `${value}` + "'><option value='0'>No</option><option value='1'>Yes</option></select>"
                  newTd.children[0].children[`${value}`].setAttribute('selected', 'true');
                  break;
                default:
                  newTd.innerHTML = "<input type='text' class='cell-" + `${key}` + "' default='" + `${value}` + "' value='" + `${value}` + "'>";
                  break;
              }

            }
            let deleteRow = row.insertCell(-1)
            deleteRow.innerHTML = "<div class='aw-delete'>✗</div>"
            deleteRow.className = "cell-delete"
            refreshRow()
          }

          // Watch for edits to the fields, compare whole arrays when edited, handle marking for upload
          $('.cell-user, .cell-name, .cell-img, .cell-issuer, .cell-desc, .cell-visible').focusout(function() {
            let $pTr = $(this).parents('tr').eq(0),
              defArray = [],
              editArray = [];
            $pTr.find('input, select').each(function(e) {
              defArray.push($(this).attr('default'))
              switch (e) { // Separate the username field. we need to append the user ID instead
                case 1:
                  editArray.push(inverseUserMap[$(this).val()] + '')
                  break;
                default:
                  editArray.push($(this).val())
                  break;
              }
            })

            if (defArray.length === editArray.length && defArray.every((value, index) => value === editArray[index])) {
              console.log('arrays matched')
              console.log(defArray, editArray)
              if ($pTr.hasClass('aw-marked-for-upload')) {
                $pTr.removeClass()
                $pTr.find('.aw-controls-wrap').remove()
                awCon.textContent = 'Row #' + $pTr.attr('rownum') + ' has been reset\n' + awCon.textContent
              }
            } else {
              console.log('arrays do not match')
              console.log(defArray, editArray)
              if (!$pTr.hasClass('aw-marked-for-upload')) {
                $pTr.addClass('aw-marked-for-upload')
                $pTr.append($('<div class="aw-controls-wrap"><span class="aw-controls-confirm">☑</span> <span class="aw-controls-cancel">☒</span></div>'))
                awCon.textContent = 'Row #' + $pTr.attr('rownum') + ' has been altered\n' + awCon.textContent
              }
            }
          })


          // aw-controls-cancel functionality
          $(document).on('click', '.aw-controls-cancel', function() {
            let $pTr = $(this).parents('tr').eq(0)
            $pTr.find('input, select').each(function(e) {
              switch (e) {
                case 1:
                  $(this).val(userMap[$(this).attr('default')])
                  if (!userMap[$(this).attr('default')]) {
                    $(this).val('undefined')
                  }
                  break;
                default:
                  $(this).val($(this).attr('default'))
                  break;
              }
            })
            $pTr.removeClass('aw-marked-for-upload')
            $pTr.find('.aw-controls-wrap').remove()
            awCon.textContent = 'Row #' + $pTr.attr('rownum') + ' has been reset\n' + awCon.textContent
          })

          // aw-mark-for-deletion functionality
          $(document).on('click', '.aw-delete', function() {
            $(this).parents('tr').eq(0).toggleClass('aw-marked-for-deletion')
          })

          // Search functionality
          $('#aw-search').click(function() {
            $('.aw-hidden').removeClass('aw-hidden')
            let type = $('#aw-search-type').val(),
              phrase = $('#aw-search-phrase').val();
            $('.cell-' + type + ':not(.cell-' + type + '[value="' + phrase + '"])').parentsUntil($("#aw-edit"), ".aw-row").addClass('aw-hidden')
            refreshRow()
          })

          // Reset search functionality
          $('#clearsort').click(function() {
            $('.aw-hidden').removeClass('aw-hidden')
            refreshRow()
          })

          // aw-replacement functionality
          $('#aw-replace').click(function() {
            let field = $('#aw-replace-type').val(),
              originalValue = $('#aw-replace-original').val(),
              newValue = $('#aw-replace-new').val();
            $('.cell-' + field + '[value="' + originalValue + '"]').val(newValue).trigger('focusout')
          })

          // Award deletion functionality
          $('#aw-remove-selected').click(function() {
            console.log('Deleting awards..');
            $.each($('.aw-marked-for-deletion'), function() {
              var thisId = $(this).find('.cell-ID').val();
              fetch("/admin.php?act=mysql&adsess=" + token + "&act=awards&code=awardsdelete&id=" + thisId)
                .then(handleErrors)
                .then(response => response.text())
                .then(text => {
                  let parser = new DOMParser();
                  let res = parser.parseFromString(text, 'text/html');
                  let textResponse = $(res).find('.tdrow1').text().trim()
                  if (textResponse === 'Please enter a valid award id.') {
                    awCon.textContent = '#' + thisId + ' not found - Has it already been deleted?\n' + awCon.textContent
                  } else if ($(res).find('#description').text().trim() === 'The action was executed successfully') {
                    awCon.textContent = '#' + thisId + ' - The action was executed successfully\n' + awCon.textContent
                  }
                })
                .catch(function(e) {
                  console.log(e)
                  awCon.textContent = 'An error has occurred: Please see the console for details\n' + awCon.textContent
                })
              $(this).addClass('aw-deleted').removeClass('aw-marked-for-deletion')
            });
          });
		   function submitter(elem) {
            let target = $(elem);
            var thisId = target.find('.cell-ID').val(),
              thisUser = inverseUserMap[target.find('.cell-user').val()] + '', // Get the user ID from the field name
              thisName = target.find('.cell-name').val(),
              thisImg = target.find('.cell-img').val(),
              thisIssuer = target.find('.cell-issuer').val(),
              thisDesc = target.find('.cell-desc').val(),
              thisVisibility = target.find('.cell-visible').val();
            var paramUrl = "/admin.php?" + $.param({
              adsess: token,
              code: "do_awardsedit",
              act: "awards",
              id: thisId,
              mid: thisUser,
              name: thisName,
              image: thisImg,
              givenby: thisIssuer,
              description: thisDesc,
              display: thisVisibility
            })

            fetch(paramUrl)
              .then(handleErrors)
              .then(response => response.text())
              .then(text => {
                let parser = new DOMParser();
                let res = parser.parseFromString(text, 'text/html');
                let textResponse = $(res).find('.tdrow1').text().trim()
                if (textResponse === 'Please enter a valid award id.') {
                  awCon.textContent = 'Award ID#' + thisId + ' not found - Has it already been deleted?\n' + awCon.textContent
                } else if ($(res).find('#description').text().trim() === 'The action was executed successfully') {
                  awCon.textContent = '#' + thisId + ' - The action was executed successfully\n' + awCon.textContent
                  $(elem).find('.cell-user').attr('default', thisUser)
                  $(elem).find('.cell-name').attr('default', thisName)
                  $(elem).find('.cell-img').attr('default', thisImg)
                  $(elem).find('.cell-issuer').attr('default', thisIssuer)
                  $(elem).find('.cell-desc').attr('default', thisDesc)
                }
              })
              .catch(function(e) {
                console.log(e)
                awCon.textContent = 'An error has occurred: Please see the console for details\n' + awCon.textContent
              })
            $(elem).removeClass('aw-marked-for-upload')
            $(elem).find('.aw-controls-wrap').remove()
          }

          // Mass award upload functionality
          $('#aw-upload-selected').click(function() {
            console.log('Submitting awards..')
            $.each($('.aw-marked-for-upload'), function() {
              submitter(this)
            });
          })
          $('#aw-discard-changes').click(function() {
            $('.aw-controls-cancel').trigger('click')
          })
          //Individual award upload functionality

          $(document).on('click', '.aw-controls-confirm', function() {
            submitter($(this).parents('tr').eq(0))
          })
        })
    })
  })

  //Handle the multi-award side of things

  
  function resetAWForm() {
    $('#aw-m-t-dumpzone img').trigger('click')
    $('#aw-m-create-wrap input, #aw-m-create-wrap textarea').val('')
    $('#aw-m-create-wrap input, #aw-m-create-wrap span').show()
    awCon.textContent = 'Fields cleared\n' + awCon.textContent
  }

  // Reset functionality
  $('#aw-m-reset').click(function() {
    resetAWForm()
  })
  
  function updateFields(awardInfo) {
    var dataObj = JSON.parse(awardInfo)
    $('#aw-m-cell-name').val(dataObj['name'])
    $('#aw-m-cell-img').val(dataObj['img'])
    $('#aw-m-cell-issuer').val(dataObj['issuer'])
    $('#aw-m-cell-desc').val(dataObj['desc'])
    if (dataObj['visible'] === '1') {
      document.getElementById('aw-m-cell-visible').checked = true
      $('#aw-m-cell-visible').val('1')
    } else {
      document.getElementById('aw-m-cell-visible').checked = false
      $('#aw-m-cell-visible').val('0')
    }
  }

  // Saved award transfer functionality
  $(document).on('click', '#aw-m-template-container .aw-s-img', function() {
    let clone = $(this).clone()
    $(this).toggleClass('aw-selected')
    if ($('#aw-m-t-dumpzone img[tid="' + clone.attr('tid') + '"]').length > 0) {
      $('#aw-m-t-dumpzone img[tid="' + clone.attr('tid') + '"]').remove()
    } else {
      $('#aw-m-t-dumpzone').append(clone)
      var tt = clone.attr('m-info')
      updateFields(tt)
      if ($('#aw-m-t-dumpzone img').length > 1) {
        $('#aw-m-create-wrap input, #aw-m-create-wrap span').hide()
        $('#aw-m-submit').attr('aw-type', 'template')
      }
    }
  })

  $(document).on('click', '#aw-m-t-dumpzone img', function() {
    $('#aw-m-template-container .aw-s-img[tid="' + $(this).attr('tid') + '"]').toggleClass('aw-selected')
    $(this).remove();
    if ($('#aw-m-t-dumpzone img').length === 1) {
      $('#aw-m-create-wrap input, #aw-m-create-wrap span').show()
      $('#aw-m-submit').attr('aw-type', 'regular')
      var tt = $('#aw-m-t-dumpzone img').attr('m-info')
      updateFields(tt)
    }
  })
  
  function create(newAward) {
    return $('<img>').attr({
      'src': newAward['img'],
      'title': newAward['desc'],
      'tid': $('#aw-m-saved-wrap img').length + 1,
      'name': newAward['name'],
      'class': 'aw-s-img',
      'm-info': JSON.stringify(newAward)
    })
  }

  $('#aw-m-save').click(function() {
    let newAward = {};
    $('#aw-m-create-wrap input').each(function() {
      newAward[$(this).attr('m-type')] = $(this).val()
    })
    $('#aw-m-template-container').append(create(newAward))

  })

  $('#aw-m-template-load').click(function() {
    if (confirm('This will overwrite all currently loaded templates')) {

      fetch('/index.php?act=UserCP&CODE=01')
        .then(handleErrors)
        .then(response => response.text())
        .then(text => {
          let parser = new DOMParser();
          let res = parser.parseFromString(text, "text/html");
          let currentData = $(res).find('form[name="theForm"]').serializeArray()
          window.dataMkAvail = {};
          $.each(currentData, function(i, field) {
            dataMkAvail[field.name] = field.value
          })
          let templateData = dataMkAvail['' + ucpField].split('\n');
          $('#aw-m-template-container').empty()
          console.log(templateData)
          $.each(templateData, function() {
            let newAward = JSON.parse(this)
            console.log(newAward)
            $('#aw-m-template-container').append(create(newAward))
          })
        })
        .catch(function(e) {
          console.log(e)
          awCon.textContent = 'A connection error has occurred: Please see the console for details\n' + awCon.textContent
        })
    }
    resetAWForm()
  })

  $('#aw-m-template-delete').click(function() {
    $.each($('.aw-selected'), function() {
      $('.aw-s-img[tid="' + $(this).attr('tid') + '"]').remove()
    })
    if ($('#aw-m-t-dumpzone img').length <= 1) {
      $('#aw-m-create-wrap input, #aw-m-create-wrap span').show()
      $('#aw-m-submit').attr('aw-type', 'regular')
      resetAWForm()
      if ($('#aw-m-t-dumpzone img') === 1) {
        var tt = $('#aw-m-t-dumpzone img').attr('m-info')
        updateFields(tt)
      }
      $('#aw-m-create-wrap input, #aw-m-create-wrap span').show()
    }
  })

  $('#aw-m-t-s-sel, #aw-m-t-s-all').click(function() {
    let type = $(this).attr('id')
    if (type === 'aw-m-t-s-sel') {
      $.each($('.aw-selected'), function() {
        console.log('sel')
        dataMkAvail['' + ucpField] = dataMkAvail['' + ucpField] + '\n' + $(this).attr('m-info')
      })
    } else if (type === 'aw-m-t-s-all') {
      dataMkAvail['' + ucpField] = '';
      $.each($('#aw-m-template-container .aw-s-img'), function() {
        console.log('all')
        dataMkAvail['' + ucpField] = dataMkAvail['' + ucpField] + '\n' + $(this).attr('m-info')
      })
    }
    let formData = new FormData();
    formData.append('auth_key', auth_key);
    for (var key in dataMkAvail) {
      formData.append(key, dataMkAvail[key])
    }


    fetch('/index.php?', {
        method: 'POST',
        body: formData
      }).then(handleErrors)
      .then(response => response.text())
      .then(text => {
        let parser = new DOMParser();
        let res = parser.parseFromString(text, 'text/html');
        if ($(res).find('#redirect-screen')) {
          awCon.textContent = 'Templates updated\n' + awCon.textContent
        } else if ($(res).find('#board-message')) {
          awCon.textContent = 'Templates failed to update\n' + awCon.textContent
        }

      })
      .catch(function(e) {
        console.log(e)
        awCon.textContent = 'A connection error has occurred: Please see the console for details\n' + awCon.textContent
      })

  })

  $('#aw-m-cell-visible').on('change', function() {
    this.value = this.checked ? 1 : 0;
  }).change();

  $('#aw-m-submit').click(function() {
    var users = $('#aw-m-cell-user').val().split(/\n/g);
	
  function awmSubmit(paramUrl, uName) {
    fetch(paramUrl, uName)
      .then(handleErrors)
      .then(response => response.text())
      .then(text => {
        let parser = new DOMParser();
        let res = parser.parseFromString(text, 'text/html');
        if ($(res).find('.tdrow1').text().trim() === 'Please fill out the form completely.') {
          awCon.textContent = 'Submission failed (' + uName + ') - Please fill out the form completely\n' + awCon.textContent
        } else if ($(res).find('#description')) {
          awCon.textContent = '(' + uName + ') - The action was executed successfully\n' + awCon.textContent
        }
      })
      .catch(function(e) {
        console.log(e)
        awCon.textContent = 'A connection error has occurred: Please see the console for details\n' + awCon.textContent
      })
  }

    $.each(users, function() { //woulda rather use a for loop, but it was having trouble keeping track of iterations
      if ($('#aw-m-submit').attr('aw-type') === 'regular') {
        console.log('type 1')
        var paramUrl = "/admin.php?" + $.param({
          adsess: token,
          code: "awardsadd",
          act: "awards",
          username: this,
          name: $('#aw-m-cell-name').val(),
          image: $('#aw-m-cell-img').val(),
          givenby: $('#aw-m-cell-issuer').val(),
          description: $('#aw-m-cell-desc').val(),
          display: $('#aw-m-cell-visible').val()
        })
        uName = this;
        awmSubmit(paramUrl, uName)
      } else if ($('#aw-m-submit').attr('aw-type') === 'template') {
        console.log('type 2')
        var dumpImg = $('#aw-m-t-dumpzone img');
        for (var i = 0; i < dumpImg.length; i++) {
          var templateData = JSON.parse(dumpImg.eq(i).attr('m-info'))

          var paramUrl = "/admin.php?" + $.param({
            adsess: token,
            code: "awardsadd",
            act: "awards",
            username: this,
            name: templateData.name,
            image: templateData.img,
            givenby: templateData.issuer,
            description: templateData.desc,
            display: templateData.visible
          })
          uName = this;
          awmSubmit(paramUrl, uName)

        }
      }
    })
  })
})
