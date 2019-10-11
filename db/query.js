var client = require('../knexFile')

const getTest =  async() => {
    var test = await client.raw('select * from users').then((result)=> result[0])
    return test
}

const insertTeacher = async(teacher) => {
    var teacher = await client.raw('INSERT INTO teacher(user_name,fname,lname,password) VALUES(?,?,?,?)',[teacher.userName,teacher.fName,teacher.lName,teacher.password]).then(resp => resp[0].affectedRows).catch(err => console.log(err))
    return teacher
}

const insertStudent = async(student) => {
    var student = await client.raw('INSERT INTO student(user_name,fname,lname,password,college_name,stream,image) VALUES(?,?,?,?,?,?,?)',[student.userName,student.fName,student.lName,student.password,student.collegeName,student.stream,student.photo]).then(resp => resp[0].affectedRows).catch(err => console.log(err))
    return student
}

const teacherLogin = async(teacher) => {
    var teacher = await client.raw('SELECT * FROM teacher WHERE user_name=? AND password=?',[teacher.userName,teacher.password]).then(result => result[0]).catch(err => console.log(err))
    if(teacher.length){
        return [true,teacher]
    }
    else{
        return [false,teacher]
    }
}

const studentLogin = async(student) => {
    var student = await client.raw('SELECT * FROM student WHERE user_name=? AND password=?',[student.userName,student.password]).then(result => result[0]).catch(err => console.log(err))
    if(student.length){
        return [true,student]
    }
    else{
        return [false,student]
    }
}

const insertQuestion = async(question) => {
    var question = await client.raw('INSERT INTO questions(question,answer,subject,user_id,duration) VALUES(?,?,?,?,?)',[question.question,question.answer,question.subject,question.userId,question.duration]).then(resp => resp[0].affectedRows).catch(err => console.log(err))
    return question
}

const getQuestionById = async(questionId) => {
    var questions = await client.raw('SELECT * FROM questions WHERE question_id=?',[questionId]).then(result => result[0]).catch(err => console.log(err))
    return questions[0]
}

const getQuestions = async(userId) => {
    var questions = await client.raw('SELECT * FROM questions WHERE user_id=?',[userId]).then(result => result[0]).catch(err => console.log(err))
    return questions
}

const getTeacherDetail = async(userId) => {
    var teacher = await client.raw('SELECT * FROM teacher WHERE teacher_id=?',[userId]).then(result => result[0]).catch(err => console.log(err))    
    return teacher
}

const deleteQuestion = async(questionId) => {
    var question = await client.raw('DELETE FROM questions WHERE question_id=?',[questionId]).then(resp => resp[0].affectedRows).catch(err => console.log(err))
    return question
}

const updateQuestion = async(question) => {
    var question = await client.raw('UPDATE questions SET question=?,answer=?,subject=?,duration=? WHERE question_id=?',[question.question,question.answer,question.subject,question.duration,question.question_id]).then(resp => resp[0].affectedRows).catch(err => console.log(err))
    return question
}

const insertTutorial = async(tutorial) => {
    var tutorial = await client.raw('INSERT INTO tutorials(link,subject,user_id) VALUES(?,?,?)',[tutorial.link,tutorial.subject,tutorial.userId]).then(resp => resp[0].affectedRows).catch(err => console.log(err))
    return tutorial
}

const getTutorials = async(userId) => {
    var tutorials = await client.raw('SELECT * FROM tutorials WHERE user_id=?',[userId]).then(result => result[0]).catch(err => console.log(err))
    return tutorials
}

const deleteTutorial = async(tutorialId) => {
    var tutorial = await client.raw('DELETE FROM tutorials WHERE tutorial_id=?',[tutorialId]).then(resp => resp[0].affectedRows).catch(err => console.log(err))
    return tutorial
}

const updateTutorial = async(tutorial) => {
    var tutorial = await client.raw('UPDATE tutorials SET subject=?,link=? WHERE tutorial_id=?',[tutorial.subject,tutorial.link,tutorial.tutorial_id]).then(resp => resp[0].affectedRows).catch(err => console.log(err))
    return tutorial
}

const getTutorialById = async(tutorialId) => {
    var tutorials = await client.raw('SELECT * FROM tutorials WHERE tutorial_id=?',[tutorialId]).then(result => result[0]).catch(err => console.log(err))
    return tutorials[0]
}


module.exports = { insertTeacher, insertStudent, teacherLogin, studentLogin, insertQuestion, getQuestions, getQuestionById, getTeacherDetail, deleteQuestion, 
                    updateQuestion, insertTutorial, getTutorials, deleteTutorial, updateTutorial, getTutorialById }