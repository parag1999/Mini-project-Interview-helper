var { insertTeacher } = require('./query')

const teacherInserted = async(fName,lName,userName,password) => {
    console.log(fName)
    var result = await insertTeacher(fName,lName,userName,password)
    console.log(result)
    return result
}

module.exports = { teacherInserted }