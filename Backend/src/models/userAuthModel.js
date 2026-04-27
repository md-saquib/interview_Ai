const mongoose = require("mongoose");


const registerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
})

module.exports = mongoose.model('Register',registerSchema);