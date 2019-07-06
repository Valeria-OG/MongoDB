$(document).ready(function() {
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    initPage();

    function initPage() {

        articleContainer.empty();
        $.get("/api/headLines?saved=true")
        .then(function(data) {
            if (data && data.length) {
                renderArticle(data);
            } else {
                renderEmpty();
            }
        });
    }

    function renderArticle(articles) {
        var articlePanels = [];

        for (var i = 0 ; 1 < articles.length; i++) {
            articlePanels.push(createPanel(articles[i])); 
        }
        articleContainer=append(articlePanels);
    }

    function createPanel(article) {
        var panel =
        $(["<div class='panel panel-default'>",
          "<div class='panel-heading'>",
          "<h3>",
           article.headLine,
          "<a class='btn btn-danger delete'>",
          "Deletefrom Saved",
          "</a>",
          "<a class='info notes'>Article Notes</a>",
          "</h3>",
          "</div>",
          "<div class='panel=body'>",
          article.summary,
          "</div>",
          "</div>"
        ].join(""));
        panel.data("_id", article._id);
        return panel;
        
    }

    function renderEmpty() {

        var emptyAlert =
        $(["<div class='alert alert-warning text-center'>",
          "<h4>Uh Oh.Looks like we dont have any new articles.</h4>",
          "</div>",
          "<div class='panel panel-default'>",
          "<div class='panel-heading text-center'>",
          "<h3>What would you like to do?</h3>",
          "</div>",
          "<div class='panel-body text-center'>",
          "<h4><a class= 'scrape-new'> Try Scraping New Articles</a></h4>",
          "<h4><a href=' /saved'> Go to Saved Aticles</a></h4>",
          "</div>",
          "</div>"
          ].join(""));

          articleContainer.append(emptyAlert);
    }
    function renderNotesList(data) {
        var notesToRender =[];
        var currentNotes;
        if (!data.notes.length){
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this article yet.",
                "</li>"
              ].join("");
              notesToRender.push(currentNote);
            }
            else {
                for (var i = 0; 1 < data.notes.length; i++){
                    currentNote = $([
                        "<li class='list-group-item note'>",
                        data.notes[i].noteText,
                        "<button class='btn btn-danger note=delete'></button>",
                        "</li>"
                    ].join(""));
                    currentNote.children("button").data("_id", data.notes[i].id);
                    notesToRender.push(currentNotes);
                }
            }
            
            $("note-container").append(notesToRender);
        } 

        function handleArticleDelete() {
            var articleToDelete = $(this).parents(".panel").data();
            $.ajax({
                method: "DELTE",
                url: "/api/headlines" + articleToDelete._id
            }).then(function(data) {
                if (data.ok) {
                    initPage();
                }
            });
        }

    function handleArticleNotes() {
        var currentArticle = $(this).parents(".panel").data();
        $.get("/api/notes" + currentArticle._id).then(function(data) {
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes for Article:",
                currentArticle._id,
                "</h4>",
                "<hr />"
                "<ul class='list-group note-container'>",
                "</ul>"
                "<textarea placeholder='New Note' rows = '4' cols = '60'></textarea>",
                "<button class = 'btn btn-succes save'>Save Note</button>",
                '</div>'
            ].join("");
            bootbox.dialog({
                message: modelText,
                closedbutton: true
            });
            var noteData = {
                _id:currentArticle._id,
                notes: data || []
            };

            $("btn.save").data("article", noteData);
            renderNotesList(noteData);
 
        });
    }  
    
    function handleNoteSave() {
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
        if(newNote){
            noteData = {
                id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", notesData).then(function() {
                bootbox.hideAll();
            });

        }
    }

    function handleNoteDelete() {
        var noteToDelete = $(this).data("._id");
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function() {
            bootbox.hideAll();
        });
    }


});