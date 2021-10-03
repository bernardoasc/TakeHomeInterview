
// Import Files and Libraries
const port = 3000;
const express= require("express");
const bodyParser = require("body-parser");
const path = require('path');
const app= express();
const data = require("./medications.json");

// define location of static files
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));

app.use(bodyParser.json());


var categories = [];
var displays = [];

data.forEach(medication => {
    var cat = medication.category;
    var exists = false;

    if(categories.length == 0) categories.push(cat);
    else{
        for(var i = 1; i <= categories.length; i++){
            if(cat == categories[i - 1]) {
                exists == true;
                return;
            }
            else exists == false;
        }
        if( exists == false) categories.push(cat);
    }
    
});




// set the get and post routes and request and response
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'))

app.get('/', (req, res) => {
    displays = [];
    data.forEach(medication => {
        displays.push(medication);
    })
    res.render('index', {displays, categories});
});

app.post("/index", (req,res)=>{
    
    searchName=req.body.name;
    
    res.redirect("/name");
});

app.get("/name", (req, res)=>{
    displays = [];
    reg = new RegExp(searchName, 'i');
    data.forEach(medication => {
        if(reg.test(medication.name))
        displays.push(medication);
    })
    res.render('index', {displays, categories});
})

app.post("/", (req,res)=>{
    searchCat=req.body.category;
    res.redirect("/category");
});

app.get('/category', (req, res) => {
    displays = [];

    data.forEach(medication => {
        if(searchCat == medication.category)
        displays.push(medication);
    })

    res.render('index', {displays, categories});
});



// set up the server, log the start

app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});
