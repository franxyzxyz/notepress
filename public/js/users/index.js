$(function(){

  var user_id = window.location.pathname.split("/")[2]
  API.getUserDashboard(user_id).then(function(data){
      $("#personal-header").html("<h1 class='text-center'>Dashboard of " + data.user.local.email + "</h1>")

      data.articles.forEach(function(article){
        $("#local-article").append("<div class='container'><div class='col-sm-10'><h1><a href='/article/"+ article._id + "'>" + article.title + "</a></h1></div><div class='col-sm-2'></div></div><div><pre>" + article.contentHTML +"</pre></div><small>Created at: "+ new Date(parseInt(article._id.substring(0,8), 16)*1000) +"</small>")
      })
  })


})