$(function(){
  var articleId = window.location.pathname.split("/")[2]

  $("#comment-form").hide();
  $("#showComment").on('click',function(e){
    e.preventDefault();
    $("#comment-form").show();
  })

  API.getOneArticle(articleId).then(function(data){
    $("#showcase-title").html(data.article.title);
    $("#showcase-content").html(data.article.contentHTML);
    $("#showcase-time").html(new Date(data.time));
    data.comments.forEach(function(comment){
      $("#all-comment").append('<pre><b>'+ comment.by_user.local.email +'</b><pre>' + comment.content + '</pre><p>'+ new Date(parseInt(comment._id.substring(0,8), 16)*1000) + '</p></pre>');
    })
  });

  $("#comment-form").on('submit',function(e){
    e.preventDefault();
    var comment_content = $("#comment-content").val();
    var comment_article = articleId;

    API.postComment(comment_content, comment_article).then(function(data){
      $("#comment-content").val("")
      $("#all-comment").prepend('<pre><b>'+ data.user.local.email +'</b><pre>' + data.comment.content + '</pre><p>'+ new Date(parseInt(data.comment._id.substring(0,8), 16)*1000) + '</p></pre>')
    })
  })

  $("#delete-post").on('submit',function(e){
    e.preventDefault();

    API.deleteOneArticle(articleId).then(function(data){
      window.location.href = '/'
    })

  })
})