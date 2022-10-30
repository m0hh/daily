const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    descr : {
        type: String
    },
    user : {
        type : mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    completed : {
        type: Boolean,
        required : true,
        default: false
    }
})

module.exports = mongoose.model("Task", TaskSchema)