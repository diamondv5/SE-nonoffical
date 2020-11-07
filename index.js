const express = require('express');
const path = require('path');
const db = require("./db");
const fs = require("fs");

var app = express();


app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('squirrelly').renderFile);
app.set('view engine', 'html');

app.get('/blog.html', function (req, res) {
    var offset = 0;
    var activePage = "1";
    if (req.query.page != undefined) {
        offset = (parseInt(req.query.page) - 1) * 5;
        activePage = req.query.page;
    }
    db.read();
    var posts = db.get('blogs').sortBy("updatedAt").reverse().slice(offset, offset + 5).value();
    var allPosts = db.get('blogs').value();
    var numPages = Math.ceil(allPosts.length / 5);
    var pages = [];
    for (var i = 1; i < numPages + 1; i++) {
        pages.push(i + "");
    }
    res.render('blog', { "posts": posts, "pages": pages, "activePage": activePage });
});

app.get('/blog-single.html', function (req, res) {
    db.read();
    var post = db.get('blogs').find({ id: req.query.id }).value()
    res.render('blog-single', { "title": post.title });
});

app.get("/api/blog/:id", function (req, res) {
    var markDownFilePath = path.join(__dirname, "blog", req.params.id + ".md");
    fs.readFile(markDownFilePath, 'utf8', function (err, data) {
        if (err) {
            res.status(500).end();
        } else {
            res.end(data);
        }
    });
})

app.post("/api/blog", function (req, res) {

});

app.use(express.static('public'));

app.listen(3000);