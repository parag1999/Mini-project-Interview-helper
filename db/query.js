var client = require('../knexFile')


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

const getStudentDetail = async(userId) => {
    var student = await client.raw('SELECT * FROM student WHERE student_id=?',[userId]).then(result => result[0][0]).catch(err => console.log(err))    
    return student
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

const insertNote = async(newNote) => {
    var note = await client.raw('INSERT INTO notes(note_name,user_id,subject) VALUES(?,?,?)',[newNote.noteName,newNote.userId,newNote.subject]).then(resp => resp[0].insertId).catch(err => console.log(err))
    return note
}

const updateNoteTime = async(time,noteId) => {
    var note = await client.raw('UPDATE notes SET total_time=? WHERE note_id=?',[time,noteId]).then(resp => resp[0].affectedRows).catch(err => console.log(err))
    return note
}

const getFilteredQuestions = async(subject) => {
    if(subject.toLowerCase() === 'all'){
        var questions = await client.raw('SELECT * FROM questions').then(result => result[0]).catch(err => console.log(err))
    }
    else{
        var questions = await client.raw('SELECT * FROM questions WHERE subject=?',[subject]).then(result => result[0]).catch(err => console.log(err))
    }
    return questions
}

const insertNoteQuestion = async(noteId,questionId) => {
    var note_question = await client.raw('INSERT INTO note_question(notes_id,questions_id) VALUES(?,?)',[noteId,questionId]).then(resp => resp[0].affectedRows).catch(err => console.log(err))
    return note_question
}

const getNotesById = async(userId) => {
    var notes = await client.raw('SELECT * FROM notes WHERE user_id=?',[userId]).then(result => result[0]).catch(err => console.log(err))
    return notes
}

const getQuestionsForNotes = async(noteId) => {
    var questions = await client.raw('SELECT * FROM questions WHERE question_id IN (SELECT questions_id from note_question WHERE notes_id=?)',[noteId]).then(result => result[0]).catch(err => console.log(err))
    return questions
}

module.exports = { insertTeacher, insertStudent, teacherLogin, studentLogin, insertQuestion, getQuestions, getQuestionById, getTeacherDetail, deleteQuestion, 
                    updateQuestion, insertTutorial, getTutorials, deleteTutorial, updateTutorial, getTutorialById, insertNote, getFilteredQuestions,
                    insertNoteQuestion, updateNoteTime, getStudentDetail, getNotesById, getStudentDetail, getQuestionsForNotes }