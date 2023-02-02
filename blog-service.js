const file = require('fs');     //to use file system module
var posts = [];
var Categories = [];

exports.initialize = () => {
    return new Promise ((resolve, reject) => {
        file.readFile('./data/posts.json', (err,data) => {
            if (err) {
                reject ('unable to read file');
            }
            else {
                posts = JSON.parse(data);
            }
        });

        file.readFile('./data/categories.json', (err,data)=> {
            if (err) {
                reject ('unable to read file');
            }
            else {
                Categories = JSON.parse(data);
            }
        })
        resolve();
    })
};

exports.getAllPosts = () => {
    return new Promise ((resolve,reject) => {
        if (posts.length == 0) {
            reject('no results returned');
        }
        else {
            resolve(posts);
        }
    })
};

exports.getPublishedPosts = () => {
    return new Promise ((resolve, reject) => {
        var publish = posts.filter(posts => posts.published == true);
        if (publish.length == 0) {
            reject('no results returned');
        }
        resolve(publish);
    })
};

exports.getCategories = () => {
    return new Promise((resolve,reject) => {
        if (Categories.length == 0) {
            reject ('no results returned');
        }
        else {
            resolve (Categories);
        }
    })
};


