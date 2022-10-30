const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

app = express()

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true})
const db = mongoose.connection
db.on('error',(error)=> console.log(error))
db.once('open', ()=> console.log("connected to database"))

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+'/images'))

const userRouter =require('./routes/user')
app.use('/user',userRouter)

const taskRouter = require('./routes/task')
app.use('/task', taskRouter)

app.listen(3000, ()=> {
    console.log("app is running on port 3000")
})