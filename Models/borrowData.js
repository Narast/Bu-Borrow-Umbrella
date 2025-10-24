const mongoose = require('mongoose');

const borrowDataSchema = mongoose.Schema({
    fullname: { type: String, required: true }, // *แนะนำให้เพิ่ม required
    studentId: { type: String, required: true }, // *แนะนำให้เพิ่ม required
    location: { type: String, required: true },
    duration: String,
    email: String,
    mobile: String,
    // สถานะ
    returned: { type: Boolean, default: false },
    // ข้อมูลการคืน (จะถูกอัปเดตเมื่อคืนแล้ว)
    photoPath: { type: String, default: '' },
    rating: { type: Number, default: 0 },         // ✅ เพิ่มฟิลด์ rating
    returnedAt: { type: Date, default: null }     // ✅ เพิ่มฟิลด์ returnedAt
    // createdAt ถูกเพิ่มจาก timestamps: true
}, { timestamps: true });

module.exports = mongoose.model('BorrowData', borrowDataSchema);