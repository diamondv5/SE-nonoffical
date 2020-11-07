const express = require('express');
const path = require('path');
const db = require("./db");

var app = express();
app.use(express.static('public'));

app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('squirrelly').renderFile);
app.set('view engine', 'html');


app.get('/blog.html', function (_, res) {
    var posts = db.get('blogs').sortBy("updatedAt").take(5).value()
    res.render('blog', { "posts": posts });
});

app.post("/api/blog", function (req, res) {

})

app.listen(3000);