$(function(){
  $("#new-article-content").hide();
  $("#new-article-tag").hide();

  API.getNotebooks().then(function(data){
    data.notebooks.forEach(function(notebook){
      $("#notebook-list").append("<div class='evernote-notebook' data-guid='" + notebook.guid +"'>" + notebook.name + "</div>")
    })
    $(".evernote-notebook").on('click',function(e){
      e.preventDefault();
      $(".evernote-notebook").removeClass('preview-selected')
      $(this).addClass('preview-selected');
      var current_notebook = $(this).html()
      API.getNotesMeta($(this).attr("data-guid")).then(function(data){
        $("#notebook-meta").html("<p class='text-center'>" + current_notebook +' <i class="icon ion-chevron-down"></i></p>');
        $("#select-evernote").html("");
        data.notesMeta.notes.forEach(function(note){
          $("#select-evernote").append("<div class='evernote-select' data-guid='"+ note.guid + "'><div class='preview-title'>" + note.title + "</div></div>")
        })

        $(".evernote-select").on('click',function(e){
          e.preventDefault();
          $(".evernote-select").removeClass('preview-selected')
          $(this).addClass('preview-selected')
          API.getOneNote($(this).attr('data-guid')).then(function(data){
            $("#preview-evernote").html(data.noteHtml)
          })
        })
      })
    })
  })

  $("#note-selected").on('click',function(e){
    e.preventDefault();
    $("#new-article-content").show();
    $("#new-article-tag").show();
    var guid = $(".preview-selected").attr('data-guid');
    API.getOneNote(guid).then(function(data){
      $(".editable").append(data.noteHtml)
    });
  })

  var editor = new MediumEditor('.editable', {
    placeholder: {
      text: ""
    }
  });

  editor.subscribe('editableInput', function (event, editable) {
    // AUTO-SAVE FEATURE [COMING UP]
  });

  $("#post-content").on('click',function(e){
    e.preventDefault();
    var title = $("#new-article-title").val();
    var subtitle = $("#new-article-subtitle").val();
    var content = $("#editable").html();
    var tag = $("#tag-holder").val();
    var articleContent = { title: title, article: content, tag: tag, subtitle: subtitle};

    API.postArticle(articleContent).then(function(data){
      window.location.href = "/"
    })
  })

  $("#fetch_giphy").on('click',function(e){
    e.preventDefault();
    $("#section-search-result").html("");
    var giphy_search_url = 'http://api.giphy.com/v1/gifs/search?q=' + trim($("#search_giphy_string").val()) + '&api_key=dc6zaTOxFJmzC&limit=10';

    API.getGiphy(giphy_search_url).then(function(data){
      data.data.forEach(function(result){
          $("#section-search-result").append("<img class='giphy-list' src='" + result.images.fixed_width_downsampled.url + "'>");
      });

      $(".giphy-list").on('click',function(e){
        e.preventDefault();
        $("#editable").append("<img src='" + $(this).attr('src') + "'>")
      })
    })
  })

  $("#search_giphy_string").on('focus',function(e){
    $(this).popover('show')
  })
  $("#write-pop").on('click',function(e){
    e.preventDefault();
    $(this).popover('show')
  })

  function trim(string){
    return string.toLocaleLowerCase().replace(/\s/g,'+')
  }

})