/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Kalki Tageja Student ID: 163983216 Date: 2023-02-03
*
*  Online (Cyclic) Link: ________________________________________________________
*
********************************************************************************/ 


var express = require("express");
var app = express();
var path = require('path');
var HTTP_PORT = process.env.PORT || 8080;
var blog = require(__dirname + "/blog-service.js");

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));6532


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
    
});


app.get("/posts", (req, res) => {
    blog.getPublishedPosts().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});

app.get("/blog", (req, res) => {
    blog.getAllPosts().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});

app.get("/categories", (req, res) => {
    blog.getCategories().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});

app.use((req, res) => {
    res.status(404).end('404 PAGE NOT FOUND');
});

blog.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart());
}).catch (() => {
    console.log('promises unfulfilled');
});
