//dependencies imported
const port = 3000;
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
const data = require("./medications.json");

//locating files
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(bodyParser.json());


// initializing arrays
var categories = [];
var displays = [];

// setting category array (sets all unique categories)
data.forEach(medication => {
    var cat = medication.category;
    var exists = false;

    if (categories.length == 0) categories.push(cat);
    else {
        for (var i = 1; i <= categories.length; i++) {
            if (cat == categories[i - 1]) {
                exists == true;
                return;
            }
            else exists == false;
        }
        if (exists == false) categories.push(cat);
    }

});

// setting get and post routes
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'))

app.get('/', (req, res) => {
    //makes sure display array is empty
    displays = [];
    // fills array with all items (loading list with no search items)
    data.forEach(medication => {
        displays.push(medication);
    })
    res.render('index', { displays, categories });
});

app.post("/", (req, res) => {

    //grabs both select and text box inputs
    searchName = req.body.name;
    searchCat = req.body.category;

    res.redirect("/search");
});

app.get("/search", (req, res) => {

    //makes sure array is empty
    displays = [];

    // forcing input to be a string (not null)
    var cat = searchCat + "";
    var name = searchName + "";

    // if category has a value other than default
    if (cat !== "") {
        data.forEach(medication => {

            //starts checking only medications within category
            if (cat == medication.category) {

                //checks if name is a value other than default
                if (name !== "") {

                    // sets regExp for substrings
                    reg = new RegExp(name, 'i');

                    //checks if any medication name has a substring of name input
                    if (reg.test(medication.name)) {

                        //adds that medication to array
                        displays.push(medication);

                    }
                }
                // if name value is default, display all medication with same category
                else {
                    displays.push(medication);
                }
            }

        })
    }
    //if category is set to default value
    else {

        if (name !== "") {
            data.forEach(medication => {
                reg = new RegExp(name, 'i');
                if (reg.test(medication.name))
                    displays.push(medication);
            });
        }
        // if both category and name are defaul, display full list
        else {
            data.forEach(medication => {
                displays.push(medication);
            });
        }
    }

    data.forEach(medication => {

    })
    // rendex index page with new medications
    res.render('index', { displays, categories });
})


//sets up the server
app.listen(3000, () => {
    console.log('The application is running on localhost:3000')
});
