let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let multer = require("multer");
const upload = multer({ dest: __dirname + '/uploads' });
let query = require('/home/parag/Desktop/dbms_project/db/query.js')
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
let subjectOptions = ["Data Structures","Algorithms","Computer Networks","Microprocessors"]

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
        res.redirect('/studentProfile')

    }
    else {
        res.status(400).json({ message: "Wrong User" })
    }
});

app.post('/logout', (req, res) => {
    if (req.cookies["testCookie"]) {
        res.clearCookie('testCookie')
    }
    res.redirect('/')
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


///////////////////////////////////////
// Student Dashboard //

app.get('/studentProfile',async (req, res) => {
    if (req.cookies["testCookie"]) {
        let student = await query.getStudentDetail(JSON.parse(req.cookies["testCookie"]).userId)
        let allNotes = await query.getNotesById(student.student_id)
        res.render('studentDashboard/profile',{ student: student, allNotes:allNotes })
    }
    else {
        res.status(400).json({ message: "You are not logged In" })
    }
    
})

app.get('/createNoteModal', (req, res) => {
    res.render('studentDashboard/createNoteModal')
})


app.post('/createNote',async (req, res) => {
    if (req.cookies["testCookie"]) {
        let note = {}
        note["noteName"] = req.body.noteName
        note["subject"] = req.body.subject
        note["userId"] = JSON.parse(req.cookies["testCookie"]).userId
        let noteId=  await query.insertNote(note)
        res.redirect('/selectQuestions/'+noteId+'/'+note.subject)
    }
    else {
        res.status(400).json({ message: "You are not logged In" })
    }
})

app.get('/selectQuestions/:noteId/:subject', async (req, res) => {
    if (req.cookies["testCookie"]) {
        let noteId = req.params.noteId
        let subject = req.params.subject
        let questionsList = await query.getFilteredQuestions(subject)

        res.render('studentDashboard/selectQuestions', { selectQuestions: questionsList, note_id:noteId, subject: subject })
    }
    else {
        res.status(400).json({ message: "You are not logged In" })
    }
})

app.post('/saveNotesQuestions',async (req, res) => {
    if (req.cookies["testCookie"]) {
        let noteId = req.body.noteId
        let questionsList = await query.getFilteredQuestions(req.body.subject)
        let questionIds = []
        let totalNoteTime = 0
        questionsList.forEach(question => {
            if(req.body[question.question_id]){
                questionIds.push(question.question_id)
                totalNoteTime+=question.duration
            }
        });
        if(questionIds.length){
            await query.updateNoteTime(totalNoteTime,noteId)
        
            for (let i = 0; i < questionIds.length; i++) {
                await query.insertNoteQuestion(noteId,questionIds[i]); 
            }
            res.redirect('/studentProfile')
        }
        else{
            res.status(400).json({ message: "You didn't select any questions" })
        }
    }
    else {
        res.status(400).json({ message: "You are not logged In" })
    }    
});

app.get('/notesQuestions/:noteId', async(req, res) => {
    if (req.cookies["testCookie"]) {
        let noteId = req.params.noteId
        let questionsList = await query.getQuestionsForNotes(noteId)

        res.render('studentDashboard/notesQuestions', { questions: questionsList})
    }
    else {
        res.status(400).json({ message: "You are not logged In" })
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
    res.render('teacherDashboard/postQuestions', { subjectOptions: subjectOptions })
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


app.get('/editQuestion/:questionId', async (req, res) => {
    if (req.cookies["testCookie"]) {
        let question = await query.getQuestionById(req.params.questionId)
        let subject = question.subject
        let subjects = [...subjectOptions]
        let i = subjects.findIndex(val => val === subject)
        let first = subjects[0]
        subjects.splice(0, 1, subjects[i])
        subjects[i] = first
        res.render('teacherDashboard/editQuestions', { question: question, subjectOptions: subjects })
    }
    else {
        res.status(400).json({ message: "You are not logged In" })
    }
});

app.post('/updateQuestion', async (req, res) => {
    if (req.cookies["testCookie"]) {
        let newQuestion = {}
        newQuestion["subject"] = req.body.subject
        newQuestion["question"] = req.body.question
        newQuestion["answer"] = req.body.answer
        newQuestion["duration"] = req.body.duration
        newQuestion["question_id"] = req.body.Id
        console.log(req.body)
        let affectedRows = await query.updateQuestion(newQuestion)
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

/////////////////////////////////////////////////////////////
// TEACHER AND TUTORIALS


app.get('/postTutorials', (req, res) => {
    res.render('teacherDashboard/postTutorials', { subjectOptions: subjectOptions })
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

app.get('/editTutorial/:tutorialId', async (req, res) => {
    if (req.cookies["testCookie"]) {
        let tutorial = await query.getTutorialById(req.params.tutorialId)
        let subject = tutorial.subject
        let subjects = [...subjectOptions]
        let i = subjects.findIndex(val => val === subject)
        let first = subjects[0]
        subjects.splice(0, 1, subjects[i])
        subjects[i] = first
        res.render('teacherDashboard/editTutorials', { tutorial: tutorial, subjectOptions: subjects })
    }
    else {
        res.status(400).json({ message: "You are not logged In" })
    }
});

app.post('/updateTutorial', async (req, res) => {
    if (req.cookies["testCookie"]) {
        let newTutorial = {}
        newTutorial["subject"] = req.body.subject
        newTutorial["link"] = req.body.link
        newTutorial["tutorial_id"] = req.body.Id
        console.log(req.body)
        let affectedRows = await query.updateTutorial(newTutorial)
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