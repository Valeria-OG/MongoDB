var scrape = require("../scripts/scrape");

var headLinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function(router) {

    router.get("/", function(req, res) {
        res.render("home");
    });

    router.get ("/saved", function(req,res) {
        res.render("saved");
    });

    router.get("/api/fetch", function(req, res) {
        headLinesController. fetch(function(err, docs) {
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new articles today. Check back tomorrow!"
                });
            }
            else {
                res.json({
                    message: "Added" + docs.insertedCount + "new articles!"
                });
            }
        });
    });

    router.get("/api/headLines", function(req, res){
        var query = {};
        if (req.query.saved) {
            query = req.query;
        }

        headLinesController.get(query, function (data){
            res.jason(data);
        });
    });

    router.delete("/api/headLines/:id", function(req, res){
        var query = {};
        query._id =req.params.id;
        headLinesController.delete(query, function(err, data){
            res.jason(data);
        });
    });

    router.patch("/api/headLines", function(req, res) {
        headLinesController.update(req.body, function(err, data){
            res,json(data);
        });
    });

    router.get("/api/notes/headLines_id?", function(Req, res) {
        var query = {};
        if (req.params.headLine_id) {
            query._id = req.params.headLine_id;
        }

        notesController.get(query, function(err, data){
            res.json(data);
        });
    });

    router.delete("/api/notes/:id", function(req, res){
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function(err, data){
            res.jason(data);
        });
    });
    router.post("/api/notes", function(req, res){
        notesController.save(req.body, function(data){
            res,jason(data);
        });
    });
}  
