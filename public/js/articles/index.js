$(function(){
  if (window.location.search){
    var sortStack = window.location.search.split("?")[1].split("sort=")[1];
    $("#sort-title").html("<p>" + sortStack + "</p>")
  }else{
    var sortStack = null;
    // $("#sort-title").hide()
    $("#sort-title").html("<p>Featured</p>")

  }

  API.getAllArticle(sortStack).then(function(data){
    data.articles.forEach(function(article){
      $("#article-shelter").append('<div class="col-sm-5 article-box"><div class="box-header"><img class="mini-gravatar" src="' + article.author.local.gravatar + '"><a href="/user/'+ article.author._id +'">' + article.author.local.email + '</a> in <b><a href="/articles?sort=' + article.tag + '">'+ article.tag+'</a></b><small> - ' + moment(new Date(parseInt(article._id.substring(0,8), 16)*1000)).fromNow() +'</small></div><div class="box-content"><div class="box-content-html">' + article.contentHTML + '</div><p class="read-more"><a href="/article/' + article._id + '" class="btn btn-link ">Read More...</a></p><p class="article-title">' + article.title + '</p></div></div>' )
    })
  })
})