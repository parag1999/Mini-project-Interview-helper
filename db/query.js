var client = require('../knexFile')

const getTest =  async() => {
    var test = await client.raw('select * from users').then((result)=> result[0])
    return test
}

const insertTeacher = async(fName,lName,userName,password) => {
    var teacher = await client.raw('INSERT INTO teacher(user_name,fname,lname,password) VALUES(?,?,?,?)',[userName,fName,lName,password]).then(resp => resp[0].affectedRows).catch(err => console.log(err))
    return teacher
}

module.exports = { insertTeacher }