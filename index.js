let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let multer = require("multer");
const upload = multer({dest: __dirname + '/uploads'});
let { insertTeacher, insertStudent, teacherLogin, studentLogin } = require('/home/parag/Desktop/dbms_project/db/query')
let cookieParser = require('cookie-parser')

app.set('view engine', 'ejs');
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'));

app.get("/", function (req, res) {
    res.render("login/login");
})

app.post('/signin', async (req, res) => {
    let user ={}
    user["userName"] = req.body.userName
    user["password"] = req.body.password
    let teacherUser = await teacherLogin(user)
    let studentUser = await studentLogin(user)
    if(req.cookies['testCookie']){
        res.clearCookie('testCookie')
    }
    if(teacherUser[0]){
        
        res.cookie('testCookie',JSON.stringify({
            userId:teacherUser[1][0]["teacher_id"],
            role:"teacher"}
            ),{path:'/'})
        console.log(req.cookies['testCookie'])
        res.status(200).json({message:"Correct User",user:teacherUser[1][0]})
        
    }
    else if(studentUser[0]){
        res.cookie('testCookie',JSON.stringify({
            userId:studentUser[1][0]["student_id"],
            role:"student"}
            ),{path:'/'})
        console.log(req.cookies['testCookie'])
        res.status(200).json({message:"Correct User",user:studentUser[1][0]})
        
    }
    else{
        res.status(400).json({message:"Wrong User"})
    }
});

app.get("/studentSignup", function (req, res) {
    res.render("signup/studentSignup");
})

app.get("/teacherSignup", function (req, res) {
    res.render("signup/teacherSignup");
})

app.post('/postTeacherSignup', async(req, res) => {
    let teacher = {}
    teacher["fName"] = req.body.fname
    teacher["lName"] = req.body.lname
    teacher["userName"] = req.body.userName
    teacher["password"] = req.body.password
    let affectedRows = await insertTeacher(teacher)
    if(affectedRows){
        res.redirect('/')
    }
    else{
        res.status(400).json({message:"User Already Exist or Fill all Fields"})
    }
    
    
});


app.post('/postStudentSignup', upload.single('photo'),async (req, res) => {
    let student = {}
    student["fName"] = req.body.fname
    student["lName"] = req.body.lname
    student["userName"] = req.body.userName
    student["password"] = req.body.password
    student["collegeName"] = req.body.collegeName
    student["stream"] = req.body.stream
    student["photo"] = "uploads/"+req.file.filename
    let affectedRows = await insertStudent(student)
    if(affectedRows){
        res.redirect('/')
    }
    else{
        res.status(400).json({message:"User Already Exist or Fill all Fields"})
    }
});




// Testing Functions Below

app.post('/signup', (req, res) => {
    res.redirect('/test')
});

app.get('/test',async (req, res) => {
    console.log(photo)
   res.render('test',{photo:photo}) 
});


app.listen(3000, () => {
    console.log('App listening on port 3000!');
});