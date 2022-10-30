const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const router = express.Router()
const salt = 10
const auth = require("../middleware/auth")


router.post('/signup',async (req,res)=> {
    const username = req.body.username
    const plainPassword = req.body.password
    const password = await bcrypt.hash(plainPassword,salt)
    const user = new User({
        username:username,
        password:password
    })
    try{
        const newUser =await user.save()
        res.status(201).json(newUser)
    }catch(err){
        res.json(500).json({message:err.message})
    }
})

router.post('/login', async (req,res)=> {
    try{
        const {username, password} = req.body
        if(!username || !password){
            res.status(400).json({message:"you have to send username and password"})
        }
        const user = await User.findOne({username:username})
        if(!user){
            res.status(400).json({message:"Wrong credentials"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            res.status(400).json({message:'wrong credentials'})
        }
        const token = jwt.sign({id:user._id}, process.env.jwt)
        res.status(200).json({token:token, user:user})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

router.delete('/delete',auth, async (req,res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.user)
        res.status(200).json(deletedUser)
    }catch (err) {
        res.status(500).json({message:err.message})
    }
})

module.exports = router