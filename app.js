const express = require("express");
const fs = require("fs");
    
const app = express(); 
const jsonParser = express.json();

app.listen(3000, function(){
    console.log("Started at port 3000");
});
  
app.use(express.static(__dirname + "/public"));
  
const filePath = "books.json";
app.get("/books", function(req, res){
       
    const content = fs.readFileSync(filePath,"utf8");
    const books = JSON.parse(content);
    res.send(books);
});

app.get("/books/:id", function(req, res){
       
    const id = req.params.id; 
    const content = fs.readFileSync(filePath, "utf8");
    const books = JSON.parse(content);
    let book = null;
    for(var i=0; i<books.length; i++){
        if(books[i].id==id){
            book = books[i];
            break;
        }
    }
      if(book){
        res.send(book);
    }
    else{
        res.status(404).send('book not found');
    }
});

app.post("/books", jsonParser, function (req, res) {
      
    if(!req.body) return   res.status(400).send('Please provide all fields');
    const bookName = req.body.name;
    const bookPages = req.body.pages;
    const bookDesc = req.body.desc;
    let book = {name: bookName, pages: bookPages, desc: bookDesc};
      
    let data = fs.readFileSync(filePath, "utf8");
    let books = JSON.parse(data);
     
    const id = Math.max.apply(Math,books.map(function(o){return o.id;}))
     book.id = id+1;
     books.push(book);
    data = JSON.stringify(books);
    fs.writeFileSync("books.json", data);
    res.send(book);
});

app.delete("/books/:id", function(req, res){
       
    const id = req.params.id;
    let data = fs.readFileSync(filePath, "utf8");
    let books = JSON.parse(data);
    let index = -1;
    for(var i=0; i < books.length; i++){
        if(books[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){

        const book = books.splice(index, 1)[0];
        data = JSON.stringify(books);
        fs.writeFileSync("books.json", data);
         res.send(book);
    }
    else{
        res.status(404).send('book not found');
    }
});

app.put("/books", jsonParser, function(req, res){
       
    if(!req.body) return res.sendStatus(400);
      
    const bookId = req.body.id;
    const bookName = req.body.name;
    const bookPages = req.body.pages;
    const bookDesc = req.body.desc;

      
    let data = fs.readFileSync(filePath, "utf8");
    const books = JSON.parse(data);
    let book;
    for(var i=0; i<books.length; i++){
        if(books[i].id==bookId){
            book = books[i];
            break;
        }
    }

    if(book){

        book.pages = bookPages;
        book.name = bookName;
        book.desc = bookDesc;
        data = JSON.stringify(books);
        fs.writeFileSync("books.json", data);
        res.send(book);
    }
    else{
        res.status(404).send(book);
    }
});
   
