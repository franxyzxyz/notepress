$(function(){
  $("#new-article-content").hide();
  $("#new-article-tag").hide();

  API.getNewArticle().then(function(data){
    console.log(data)
    $("#notebook-meta").append("<p>No. of notes: " + data.notesMeta.totalNotes);
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
  });

  $("#note-selected").on('click',function(e){
    e.preventDefault();
    $("#new-article-content").show();
    $("#new-article-tag").show();
    var guid = $(".preview-selected").attr('data-guid');
    API.getOneNote(guid).then(function(data){
      console.log(data)
      $(".editable").append(data.noteHtml)
    });
  })

  var editor = new MediumEditor('.editable', {
    placeholder: {
      text: ""
    }
  });

  editor.subscribe('editableInput', function (event, editable) {
    // Do some work
    // console.log(editable.innerHTML)
  });

  $("#post-content").on('click',function(e){
    e.preventDefault();
    var title = $("#new-article-title").val();
    var content = $("#editable").html();
    var tag = $("#tag-holder").val();
    var articleContent = { title: title, article: content, tag: tag};

    API.postArticle(articleContent).then(function(data){
      console.log("POST DONE")
      console.log(data)
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
        console.log($(this).attr('src'))
        $("#editable").append("<img src='" + $(this).attr('src') + "'>")
      })
    })
  })


  // $(".editable").on('focus',function(e){
  //     $(".giphy-list").one('click',function(e){
  //       e.preventDefault();
  //       console.log($(this).attr('src'))
  //       $("#editable").append("<img src='" + $(this).attr('src') + "'>")
  //     })
  // })

  function trim(string){
    return string.toLocaleLowerCase().replace(/\s/g,'+')
  }

})