$(function(){
  API.getAllArticle().then(function(data){
    data.articles.forEach(function(article){
      $("#article-shelter").append('<div class="col-sm-5 article-box"><div class="box-header"><a href="#">' + article.author.local.email + "</a> in " + article.tag + '</div><div class="box-content"><div>' + article.contentHTML + '</div><p class="read-more"><a href="/article/' + article._id + '" class="btn btn-link read-more" style="color:white">Read More</a></p><p class="article-title">' + article.title + '</p></div></div>' )
    })
  })
})