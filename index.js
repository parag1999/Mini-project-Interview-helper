let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let multer = require("multer");
const upload = multer({ dest: __dirname + '/uploads' });
let query = require('C:/Users/ratho/Desktop/Palash/DBMS_Project/dbms_project/db/query')
let cookieParser = require('cookie-parser')

app.set('view engine', 'ejs');
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'));

const selectQuestionsList = [{ subject: "Data Structures", question: "sdgsfgasg", answer: "vasfvfsdv", duration: 2 },
{ subject: "Data Structures", question: "sdgsfgasg", answer: "vasfvfsdv", duration: 2 },
{ subject: "Data Structures", question: "sdgsfgasg", answer: "vasfvfsdv", duration: 2 },
{ subject: "Algorithms", question: "sdgsfgasg", answer: "vasfvfsdv", duration: 2 },
{ subject: "Algorithms", question: "sdgsfgasg", answer: "vasfvfsdv", duration: 2 },
{ subject: "Microprocessors", question: "sdgsfgasg", answer: "vasfvfsdv", duration: 2 },
{ subject: "Microprocessors", question: "sdgsfgasg", answer: "vasfvfsdv", duration: 2 },
]

// USER LOGIN AND SIGN UP

app.get("/", function (req, res) {
    res.render("login/login");
})

app.post('/signin', async (req, res) => {
    let user = {}
    user["userName"] = req.body.userName
    user["password"] = req.body.password
    let teacherUser = await query.teacherLogin(user)
    let studentUser = await query.studentLogin(user)
    if (req.cookies['testCookie']) {
        res.clearCookie('testCookie')
    }
    if (teacherUser[0]) {

        res.cookie('testCookie', JSON.stringify({
            userId: teacherUser[1][0]["teacher_id"],
            role: "teacher"
        }
        ), { path: '/' })
        console.log(req.cookies['testCookie'])
        res.redirect('/teacherProfile')

    }
    else if (studentUser[0]) {
        res.cookie('testCookie', JSON.stringify({
            userId: studentUser[1][0]["student_id"],
            role: "student"
        }
        ), { path: '/' })
        console.log(req.cookies['testCookie'])
        res.status(200).json({ message: "Correct User", user: studentUser[1][0] })

    }
    else {
        res.status(400).json({ message: "Wrong User" })
    }
});

app.get("/studentSignup", function (req, res) {
    res.render("signup/studentSignup");
})

app.get("/teacherSignup", function (req, res) {
    res.render("signup/teacherSignup");
})

app.post('/postTeacherSignup', async (req, res) => {
    let teacher = {}
    teacher["fName"] = req.body.fname
    teacher["lName"] = req.body.lname
    teacher["userName"] = req.body.userName
    teacher["password"] = req.body.password
    let affectedRows = await query.insertTeacher(teacher)
    if (affectedRows) {
        res.redirect('/')
    }
    else {
        res.status(400).json({ message: "User Already Exist or Fill all Fields" })
    }


});


app.post('/postStudentSignup', upload.single('photo'), async (req, res) => {
    let student = {}
    student["fName"] = req.body.fname
    student["lName"] = req.body.lname
    student["userName"] = req.body.userName
    student["password"] = req.body.password
    student["collegeName"] = req.body.collegeName
    student["stream"] = req.body.stream
    student["photo"] = "uploads/" + req.file.filename
    let affectedRows = await query.insertStudent(student)
    if (affectedRows) {
        res.redirect('/')
    }
    else {
        res.status(400).json({ message: "User Already Exist or Fill all Fields" })
    }
});

/////////////////////////////////////////
// TEACHER AND QUESTIONS

app.get('/teacherProfile', async (req, res) => {
    if (req.cookies["testCookie"]) {
        let teacher = await query.getTeacherDetail(JSON.parse(req.cookies["testCookie"]).userId)
        res.render('teacherDashboard/profile', { name: teacher[0].fname + teacher[0].lname })
    }
    else {
        res.status(400).json({ message: "You are not logged In" })
    }

})

app.get('/postQuestions', (req, res) => {
    res.render('teacherDashboard/postQuestions')
})

app.post('/postQuestion', async (req, res) => {
    if (req.cookies["testCookie"]) {
        let newQuestion = {}
        newQuestion["subject"] = req.body.subject
        newQuestion["question"] = req.body.question
        newQuestion["answer"] = req.body.answer
        newQuestion["duration"] = req.body.duration
        newQuestion["userId"] = JSON.parse(req.cookies["testCookie"]).userId
        let affectedRows = await query.insertQuestion(newQuestion)
        if (affectedRows) {
            res.redirect('/listQuestions')
        }
        else {
            res.status(400).json({ message: "Wrong Entry" })
        }
    }
    else {
        res.status(400).json({ message: "You are not logged In" })
    }

})

app.get('/listQuestions', async (req, res) => {
    if (req.cookies["testCookie"]) {
        let userId = JSON.parse(req.cookies["testCookie"]).userId
        let questionsList = await query.getQuestions(userId)
        res.render('teacherDashboard/listQuestions', { questions: questionsList })
    }
    else {
        res.status(400).json({ message: "You are not logged In" })
    }

})

app.get('/deleteQuestion/:questionId', async (req, res) => {
    if (req.cookies["testCookie"]) {
        let affectedRows = await query.deleteQuestion(req.params.questionId)
        if (affectedRows) {
            let userId = JSON.parse(req.cookies["testCookie"]).userId
            res.redirect('/listQuestions/' + userId)
        }
        else {
            res.status(400).json({ message: "Question wasn't deleted" })
        }
    }
    else {
        res.status(400).json({ message: "You are not logged In" })
    }
});

/////////////////////////////////////////////////////////////
// TEACHER AND TUTORIALS


app.get('/postTutorials', (req, res) => {
    res.render('teacherDashboard/postTutorials')
})

app.post('/postTutorial', async (req, res) => {
    if (req.cookies["testCookie"]) {
        var newTutorial = {}
        newTutorial["subject"] = req.body.subject
        newTutorial["link"] = req.body.link
        newTutorial["userId"] = JSON.parse(req.cookies["testCookie"]).userId
        let affectedRows = await query.insertTutorial(newTutorial)
        if (affectedRows) {
            res.redirect('/listTutorials')
        }
        else {
            res.status(400).json({ message: "Wrong Entry" })
        }
    }
    else {
        res.status(400).json({ message: "You are not logged In" })
    }
})



app.get('/listTutorials', async (req, res) => {
    if (req.cookies["testCookie"]) {
        let userId = JSON.parse(req.cookies["testCookie"]).userId
        let tutorialsList = await query.getTutorials(userId)
        res.render('teacherDashboard/listTutorials', { tutorials: tutorialsList })
    }
    else {
        res.status(400).json({ message: "You are not logged In" })
    }

})

app.get('/deleteTutorial/:tutorialId', async (req, res) => {
    if (req.cookies["testCookie"]) {
        let affectedRows = await query.deleteTutorial(req.params.tutorialId)
        if (affectedRows) {
            let userId = JSON.parse(req.cookies["testCookie"]).userId
            res.redirect('/listTutorials/' + userId)
        }
        else {
            res.status(400).json({ message: "Tutorial wasn't deleted" })
        }
    }
    else {
        res.status(400).json({ message: "You are not logged In" })
    }
});

///////////////////////////////////////
// Student Dashboard //

app.get('/studentProfile', (req, res) => {
    res.render('studentDashboard/profile')
})

app.get('/createNoteModal', (req, res) => {
    res.render('studentDashboard/createNoteModal')
})

app.get('/selectQuestions', (req, res) => {
    res.render('studentDashboard/selectQuestions')
})

app.post('/createNote', (req, res) => {
    var noteName = req.body.noteName
    var subject = req.body.subject
    console.log(noteName)
    console.log(subject)
    res.redirect('/selectQuestions')
})

app.get('/selectQuestions', (req, res) => {
    res.render('studentDashboard/selectQuestions', { selectQuestions: selectQuestionsList })

})

//////////////////////////////////
// Testing Functions Below

app.post('/signup', (req, res) => {
    res.redirect('/test')
});

app.get('/test', async (req, res) => {
    console.log(photo)
    res.render('test', { photo: photo })
});



app.listen(3000, () => {
    console.log('App listening on port 3000!');
});