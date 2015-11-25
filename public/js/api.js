var API_WRAPPER = function(){
  this.URL_BASE = window.location.origin;

/// API: ARTICLE
  // get all articles
  this.getAllArticle = function(){
    return $.ajax({
      url: '../../api/articles/',
      type: 'GET'
    });
  };
  // get one article [params: article_id]
  this.getOneArticle = function(article_id){
    return $.ajax({
      url: '../../api/article/' + article_id,
      type: 'GET'
    });
  }

  this.deleteOneArticle = function(article_id){
    return $.ajax({
      url: '../../api/article/' + article_id,
      type: 'DELETE'
    });
  }
/// API: USER
 // get dashboard
  this.getUserDashboard = function(user_id){
    return $.ajax({
      url: '../../api/user/' + user_id,
      type: 'GET',
    });
  }

/// API: COMMENT
/// post a comment [params: content, Target-Article]
  this.postComment = function(comment_content, comment_article){
    return $.ajax({
      url: '../../api/comment',
      type: 'POST',
      data: {
        comment: {
          content: comment_content,
          article: comment_article
        }
      }
    });
  }

}
