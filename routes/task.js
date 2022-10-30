const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

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