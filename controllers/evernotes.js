var passport = require("passport");
var Evernote = require('evernote').Evernote;

function getNewArticle(req,res){
  res.render('articles/new')
}

// function getNotesList(req,res){
//   var client = new Evernote.Client({token: req.user.evernote.access_token});

//   var noteStore = client.getNoteStore();

//   noteStore.listNotebooks(function(err, notebooks) {
//     var filter = new Evernote.NoteFilter();
//     resultSpec = new Evernote.NotesMetadataResultSpec();
//     resultSpec.includeTitle=true;

//     filter.notebookGuid = notebooks[0].guid;
//     noteStore.findNotesMetadata(filter, 0, 100, resultSpec, function(err, notesMeta){
//       console.log(notesMeta)

//       res.render('show',{notesMeta})
//     })
//   });
// }

function getNoteByGuid(req,res){
  var guid = req.params.guid
  res.render('contentPage', {guid})
}

module.exports = {
  // getNotesList:   getNotesList,
  getNoteByGuid:  getNoteByGuid,
  getNewArticle:  getNewArticle
}