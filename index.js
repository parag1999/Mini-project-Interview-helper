var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var client = require('./knexFile')

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))

const getTest =  async() => {
    var test = await client.raw('select * from users').then((result)=> result[0])
    return test
}

const testFunc = async() => {
    var finalTest = await getTest()
    return finalTest.map((val)=> (val.user_id))
}


app.get('/signup',async (req, res) => {
    let testVal = await testFunc()
    console.log(testVal)
   res.render('signup',{data:testVal}) 
});


app.listen(3000, () => {
    console.log('App listening on port 3000!');
});