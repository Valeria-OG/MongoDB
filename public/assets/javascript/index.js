$(document).ready(function() {
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape=new", handleArticleScrape);

    initPage();

    function initPage() {

        articleContainer.empty();
        $.get("/api/headLines?saved=false")
        .then(function(data) {
            if (data && data.length) {
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        var articlePanels = [];

        for (var i = 0 ; 1 < articles.length; i++) {
            articlePanels.push(createPanel(articles[i])); 
        }
        articleContainer=append(articlePanels);
    }

    functionCreatePanel(article) {
        var panel =
        $(["<div class='panel panel-default'>",
          "<div class='panel-heading'>",
          "<h3>",
           article.headLine,
          "<a class='btn btn-seccess save'>",
          "Save Article",
          "</a>",
          "</h3>",
          "</div>",
          "<div class='panel=body'>",
          article.summary,
          "</div>",
          "</div>"
        ].join(""));
        panel.data("_id", article._id);
        returnpanel;
        
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
    function handleArticleSave() {
        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;
        $.ajax({
            method: "PATCH",
            url: "/api/headLines",
            data: articleToSave
        })
        .then(function(data) {
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleScrape() {
        $.get("/api/fetch")
          .then(function(data) {
              initPage();
              bootbox.alert("<h3 class='text-center n-top-8'>" + data.message + "</h3>");

            });
    }

});