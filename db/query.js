var client = require('../knexFile')

const getTest =  async() => {
    var test = await client.raw('select * from users').then((result)=> result[0])
    return test
}

const insertStudent = async() => {
    var student = await client.raw('INSERT INTO student(user_name,fname)')
}