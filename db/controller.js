var { insertTeacher, insertStudent, teacherLogin, studentLogin } = require('./query')

const teacherInserted = async(teacher) => {
    var result = await insertTeacher(teacher)
    console.log(result)
    return result
}

const studentInserted = async(student) => {
    var result = await insertStudent(student)
    console.log(result)
    return result
}

const teacherLoggedIn = async(teacher) => {
    let user = await teacherLogin(teacher)
    if(user.length){
        return [true,user]
    }
    else{
        return [false,user]
    }
}

const studentLoggedIn = async(student) => {
    let user = await studentLogin(student)
    if(user.length){
        return [true,user]
    }
    else{
        return [false,user]
    }
}

module.exports = { teacherInserted, studentInserted, teacherLoggedIn, studentLoggedIn }