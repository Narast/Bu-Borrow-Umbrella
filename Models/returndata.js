const mongoose = require('mongoose');
const returnDataSchema = mongoose.Schema({
    studentId: { type: String, required: true },
    rating: { type: Number, default: 0 },
    photoPath: { type: String, default: '' },
    // สถานะ
    returned: { type: Boolean, default: true },
    returnedAt: { type: Date, default: Date.now },
    originalBorrowId: { type: mongoose.Schema.Types.ObjectId, ref: 'BorrowData' } 
}, { timestamps: true });

module.exports = mongoose.model('ReturnData', returnDataSchema);