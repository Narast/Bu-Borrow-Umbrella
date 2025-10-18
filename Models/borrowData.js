const mongoose = require('mongoose')

const borrowDataSchema = mongoose.Schema({
    fullname : String,
    studentId : String,
    location : String,
    duration : String,
    email : String,
    mobile : String
    
},{ timestamps : true})

module.exports = mongoose.model('BorrowData', borrowDataSchema)