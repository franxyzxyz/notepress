$(function(){
  var articleId = window.location.pathname.split("/")[2]

  var editor = new MediumEditor('.editable', {
    placeholder: {
      text: ""
    }
  });

  editor.subscribe('editableInput', function (event, editable) {
    // Do some work
    // console.log(editable.innerHTML)
  });

  API.editArticle(articleId).then(function(data){
    $("#new-article-title").val(data.article.title);
    $("#editable").html(data.article.contentHTML);
  })

  $("#post-content").on('click',function(e){
    e.preventDefault();
    var title = $("#new-article-title").val();
    var content = $("#editable").html();
    var tag = $("#tag-holder").val();
    var articleContent = { title: title, article: content, tag: tag};

    API.updateArticle(articleId, articleContent).then(function(data){
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
        $("#editable").append("<img src='" + $(this).attr('src') + "'>")
      })
    })
  })
  function trim(string){
    return string.toLocaleLowerCase().replace(/\s/g,'+')
  }
})