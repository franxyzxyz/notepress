$(function(){
  if (window.location.search){
    var sortStack = window.location.search.split("?")[1].split("sort=")[1];
    $("#sort-title").html("<p>" + sortStack + "</p>")
  }else{
    var sortStack = null;
    $("#sort-title").html("<p>Featured</p>")

  }

  API.getAllArticle(sortStack).then(function(data){
    var count = 0
    data.articles.forEach(function(article){
      if (article.tag[0] == "Node.js" && count == 0){
          count = 1;
          $("#nodejs").append('<div class="col-sm-12"><div class="box-header"><img class="mini-gravatar" src="' + article.author.local.gravatar + '"><a href="/user/'+ article.author._id +'">' + article.author.local.email + '</a> in <b><a href="/articles?sort=' + article.tag + '">'+ article.tag+'</a></b><small> - ' + moment(new Date(parseInt(article._id.substring(0,8), 16)*1000)).fromNow() +'</small></div><a href="/article/' + article._id + '" class="btn btn-link side-article-title">' + article.title + '</a><div class="side-article-subtitle">' + article.subtitle + '</div><p><a href="/article/' + article._id + '" class="btn btn-link ">Read More...</a></p></div><hr>');
        }

      $("#article-shelter").append('<div class="article-box"><div class="box-header"><img class="mini-gravatar" src="' + article.author.local.gravatar + '"><a href="/user/'+ article.author._id +'">' + article.author.local.email + '</a> in <b><a href="/articles?sort=' + article.tag + '">'+ article.tag + '</a></b><small> - ' + moment(new Date(parseInt(article._id.substring(0,8), 16)*1000)).fromNow() +'</small><div><a class="article-title" href="/article/' + article._id + '">' + article.title + '</a></div></div><div class="article-subtitle">' + article.subtitle + '</div><p><a href="/article/' + article._id + '" class="btn btn-link ">Read More...</a></p></div></div><hr>' )
    })
  })
})