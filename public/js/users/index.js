$(function(){

  var user_id = window.location.pathname.split("/")[2]
  API.getUserDashboard(user_id).then(function(data){
      // $("#dashboard-title").html("<p>"+ data.user.local.email +"</p>")
      $("#grav-target").html('<img src="' + data.user.local.gravatar + 'class="large-gravatar">');
      $("#user-meta").html("<p>Email: <a href='mailto:"+ data.user.local.email +"'>"+ data.user.local.email +"</a></p>")
      // $("#personal-header").html("<h1 class='text-center'>Dashboard of " + data.user.local.email + "</h1>")

      data.articles.forEach(function(article){
        $("#local-article").append("<div class='container'><div class='col-sm-10'><h1><a href='/article/"+ article._id + "'>" + article.title + "</a></h1></div><div class='col-sm-2'></div></div><div class='user-article'>" + article.contentHTML +"</div><small>Created: "+ moment(new Date(parseInt(article._id.substring(0,8), 16)*1000)).calendar() +"</small>")
      })
  })


})