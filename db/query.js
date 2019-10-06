var client = require('../knexFile')

const getTest =  async() => {
    var test = await client.raw('select * from users').then((result)=> result[0])
    return test
}