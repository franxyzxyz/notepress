var API_WRAPPER = function(){
  this.URL_BASE = window.location.origin;

/// API: ARTICLE
  // get all articles
  this.getAllArticle = function(sort_stack){
    if (!sort_stack){
      return $.ajax({
        url: '../../api/articles',
        type: 'GET'
      });
    }else{
      return $.ajax({
        url: '../../api/articles?sort=' + sort_stack,
        type: 'GET'
      });
    }
  };


  // get one article [params: article_id]
  this.getOneArticle = function(article_id){
    return $.ajax({
      url: '../../api/article/' + article_id,
      type: 'GET'
    });
  }

  this.getNotesMeta = function(notebook_guid){
    return $.ajax({
      url: '../../api/notebooks/' + notebook_guid,
      type: 'GET'
    });
  }

  this.getNewArticle = function(){
    return $.ajax({
      url: '../../api/article',
      type: 'GET'
    });
  }

  this.postArticle = function(articleContent){
    return $.ajax({
      url: '../../api/article',
      type: 'POST',
      data: articleContent
    });
  }

  this.editArticle = function(article_id){
    return $.ajax({
      url  : "../../api/article/" + article_id + "/edit",
      type: 'GET'
    })
  }
  this.updateArticle = function(article_id, articleContent){
    return $.ajax({
      url  : "../../api/article/" + article_id,
      type: 'PUT',
      data: articleContent
    })
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
  this.deleteComment = function(comment_id){
    return $.ajax({
      url: '../../api/comment/' + comment_id,
      type: 'DELETE'
    });
  }

///fetch from evernote
  this.getOneNote = function(guid){
    return $.ajax({
      url: '../../api/guid/' + guid,
      type: 'GET',
    })
  }

  this.getNotebooks = function(){
    return $.ajax({
      url: '../../api/notebooks',
      type: 'GET',
    })
  }

//// EXTERNAL API
  this.getGiphy = function(search_url){
    return $.ajax({
      url:  search_url,
      type: 'GET'
    })
  }
}
