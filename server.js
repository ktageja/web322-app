/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part * 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Kalki Tageja 
*  Student ID: 163983216
*  Date: 2023-02-19
*
*  Online (Cyclic) Link: https://excited-khakis-wasp.cyclic.app/
*
********************************************************************************/ 


var express = require("express");
var app = express();
var path = require('path');
var HTTP_PORT = process.env.PORT || 8080;
var blogService= require(__dirname + "/blog-service.js");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');


function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));


cloudinary.config({
    cloud_name: 'dof5wvptk',
    api_key: '669218948891845',
    api_secret: 'unsaXGzxe6meJUjQFEaFLl-B4lY',
    secure: true
});
const fileUpload = multer();

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

app.get("/posts/add", (req, res) => {
    res.sendFile(__dirname + "/views/addPost.html");
  });
  
  app.post("/posts/add", fileUpload.single("featureImage"), (req, res) => {
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
  
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
  
      async function upload(req) {
        let result = await streamUpload(req);
        return result;
      }
  
      upload(req).then((uploaded) => {
        processPost(uploaded.url);
      });
    } else {
      processPost("");
    }
  
    function processPost(imageUrl) {
      req.body.featureImage = imageUrl;
      blogService.addPost(req.body);
      res.redirect("/posts");
    }
  });
  
  app.get("/posts", (req, res) => {
    const category = req.query.category;
    const minDate = req.query.minDate;
  
    if (category) {
      blogService
        .getPostsByCategory(category)
        .then((posts) => {
          res.json(posts);
        })
        .catch((err) => {
          res.json({ message: err });
        });
    } else if (minDate) {
      blogService
        .getPostsByMinDate(minDate)
        .then((posts) => {
          res.json(posts);
        })
        .catch((err) => {
          res.json({ message: err });
        });
    } else {
      blogService
        .getAllPosts()
        .then((posts) => {
          res.json(posts);
        })
        .catch((err) => {
          res.json({ message: err });
        });
    }
  });
  
  app.get("/post/:id", (req, res) => {
    const id = req.params.id;
    blogService
      .getPostById(id)
      .then((post) => {
        res.json(post);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  });
  


    app.get("/categories", (req, res) => {
    blogService
      .getCategories()
      .then((categories) => {
        res.json(categories);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  });
  
  app.get("/blog", (req, res) => {
    blogService
      .getPublishedPosts()
      .then((posts) => {
        res.json(posts);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  });

app.use((req, res) => {
    res.status(404).end('404 PAGE NOT FOUND');
});


blogService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Express http server listening on " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
