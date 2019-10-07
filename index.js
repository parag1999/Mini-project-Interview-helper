var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var multer = require("multer");
var { teacherInserted } = require('/home/parag/Desktop/dbms_project/db/controller')

var photo = ""

const upload = multer({dest: __dirname + '/uploads/images'});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", function (req, res) {
    res.render("login/login");
})

app.get("/studentSignup", function (req, res) {
    res.render("signup/studentSignup");
})

app.get("/teacherSignup", function (req, res) {
    res.render("signup/teacherSignup");
})

app.post('/postTeacherSignup', async(req, res) => {
    var fName = req.body.fname
    var lName = req.body.lname
    var userName = req.body.userName
    var password = req.body.password
    await teacherInserted(fName,lName,userName,password)
    
});

app.post('/signup', (req, res) => {
    res.redirect('/test')
});

app.post('/postStudentSignup', upload.single('photo'), (req, res) => {
    var fName = req.body.fname
    var lName = req.body.lname
    var userName = req.body.userName
    var password = req.body.password
    var collegeName = req.body.collegeName
    var stream = req.body.stream
    photo = req.file.path
    res.redirect('test')
});



// const testFunc = async() => {
//     var finalTest = await getTest()
//     return finalTest.map((val)=> (val.user_id))
// }


app.get('/test',async (req, res) => {
    // let testVal = await testFunc()
    // console.log(testVal)
    console.log(photo)
   res.render('test',{photo:photo}) 
});


app.listen(3000, () => {
    console.log('App listening on port 3000!');
});