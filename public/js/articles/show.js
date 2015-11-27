$(function(){
  var articleId = window.location.pathname.split("/")[2]

  $("#comment-form").hide();
  $("#showComment").on('click',function(e){
    e.preventDefault();
    $("#comment-form").show();
  })

  API.getOneArticle(articleId).then(function(data){
    $("#showcase-grav").html('<img class="mini-gravatar" src="' + data.article.author.local.gravatar + '">')
    $("#showcase-author").html(data.article.author.local.email);
    $("#showcase-author").on('click',function(e){
      e.preventDefault();
      window.location.href = "/user/" + data.article.author._id
    })
    $("#showcase-title").html(data.article.title);
    $("#showcase-content").html(data.article.contentHTML);
    $("#showcase-time").html(moment(new Date(data.time)).format("MMM Do YY"));
    $("#showcase-tag").html('<span class="article-tag"><span class="icon ion-pricetag"></span><a href="/articles?sort=' + data.article.tag + '">' + data.article.tag + '</span>');
    data.comments.forEach(function(comment){
      $("#all-comment").append('<div id="comment-'+ comment._id +'"><pre><b>'+ comment.by_user.local.email +'</b><pre>' + comment.content + '</pre><p>' +new Date(parseInt(comment._id.substring(0,8), 16)*1000) + '</p><a class="icon ion-trash-a delete-comment" id="delete-' + comment._id + '" data-comment="' + comment._id + '"></a></pre>');

        bindDeleteEvent($("#delete-" + comment._id), comment.by_user._id);

    });
  });

  $("#comment-form").on('submit',function(e){
    e.preventDefault();
    var comment_content = $("#comment-content").val();
    var comment_article = articleId;

    API.postComment(comment_content, comment_article).then(function(data){
      $("#comment-content").val("")
      $("#all-comment").prepend('<div id="comment-'+ data.comment._id +'"><pre><b>'+ data.user.local.email +'</b><pre>' + data.comment.content + '</pre><p>'+ new Date(parseInt(data.comment._id.substring(0,8), 16)*1000) + '</p><a class="icon ion-trash-a delete-comment" id="delete-' + data.comment._id + '" data-comment="' +  data.comment._id + '"></a></pre></div>');
      bindDeleteEvent($("#delete-" + data.comment._id), data.user._id);

    })
  })

  $("#delete-post").on('submit',function(e){
    e.preventDefault();
    if (confirm("Sure to Delete this ARticle?")){
      API.deleteOneArticle(articleId).then(function(data){
        window.location.href = '/'
      })
    }
  })

  $("#edit-post").on('click',function(e){
    console.log("ASDASD")
    e.preventDefault();
    window.location.href = window.location.pathname + "/edit"
  })

  function bindDeleteEvent(target, compare_id){
    if ($("#comment-content").attr('data-current-user') == compare_id){
      target.on('click',function(e){
        e.preventDefault();
        if (confirm("Delete Comment?")){
          var comment_id = $(this).attr('data-comment');
          API.deleteComment(comment_id).then(function(data){
            console.log("back to callback");
            $("#comment-" + comment_id).remove();
          })
        }
      })
    }else{
      target.hide();
    }
  }
})