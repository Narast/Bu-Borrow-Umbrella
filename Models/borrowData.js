const mongoose = require('mongoose');
const borrowDataSchema = mongoose.Schema({
    fullname: String,
    studentId: String,
    location: String,
    duration: String,
    email: String,
    mobile: String,
    returned: { type: Boolean, default: false },
    photoPath: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('BorrowData', borrowDataSchema);