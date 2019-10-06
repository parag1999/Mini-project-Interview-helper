var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var client = require('./knexFile')
var multer = require("multer");

const upload = multer({dest: __dirname + '/uploads/images'});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", function (req, res) {
    res.render("signup");
})

app.post('/signup', (req, res) => {
    res.redirect('/test')
});

app.post('/upload', upload.single('photo'), (req, res) => {
    if(req.file) {
        res.json(req.file);
    }
    else throw 'error';
});



// const testFunc = async() => {
//     var finalTest = await getTest()
//     return finalTest.map((val)=> (val.user_id))
// }


app.get('/test',async (req, res) => {
    // let testVal = await testFunc()
    // console.log(testVal)
   res.render('test') 
});


app.listen(3000, () => {
    console.log('App listening on port 3000!');
});