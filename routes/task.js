const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')
const schedule = require('node-schedule')


router.post('/create', auth,async (req,res) => {
    
    const task = new Task({
        name: req.body.name,
        descr: req.body.descr,
        user: req.user,
        })
    try{
        const newTask = await task.save()
        res.status(201).json(newTask)
    }catch (err){
        res.status(500).json({message:err.message})
    }
})

router.get('/all', auth, async (req,res)=>{
    try{
        const tasks = await Task.find({user:req.user})
        res.status(200).json(tasks)
    }catch (err){
        res.status(500).json({message:err.message})
    }
})

router.get('/:id',auth,getOne, (req,res)=>{
    res.status(200).json(req.task)
})

router.patch('/:id',auth,getOne ,async (req,res)=>{
    if (req.body.name != null){
        req.task.name = req.body.name
    }
    if(req.body.descr != null){
        req.task.dscr = req.body.descr
    }
    if(req.body.completed != null){
        req.task.completed = req.body.completed
    }
    try{
        const newTask = await req.task.save()
        res.status(200).json(newTask)
    }catch (err){
        res.status(500).json({message:err.message})
    }

})
router.delete('/:id',auth, getOne,async (req,res) => {
    try {
        await req.task.remove()
        res.status(200).json({message:"Deleted"})
    }catch (err){
        res.status(500).json({message:err.message})
    }
})

const j = schedule.scheduleJob({hour: 0},async () => {
    console.log("working")
    await Task.updateMany({"completed": true}, {"$set":{"completed": false}})
  })

async function getOne(req,res,next){
    let task
    try{
        task = await Task.findById(req.params.id)
        if(!task){
            return res.status(400).json({message:"task not found"})
        }
        if(task.user != req.user){
            return res.status(403).json({message:"Unauthorized"})
        }

    }catch (err){
        return res.status(500).json({message: err.message})
    }
    req.task = task
    next()
}

module.exports = router