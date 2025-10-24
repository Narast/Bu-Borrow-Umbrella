const express = require('express');
const path = require('path');
const connectDB = require('./Config/db');
const BorrowData = require('./Models/borrowData');
const ReturnData = require('./Models/returndata'); // เพิ่มการ import ReturnData
const multer = require('multer');
const fs = require('fs');

const website_bu_unbella = express();

website_bu_unbella.use(express.json());
website_bu_unbella.use(express.static(path.join(__dirname, 'public'))); // ใช้ public folder สำหรับไฟล์ static

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'Uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Middleware เพื่อจัดการข้อผิดพลาดของ multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' });
    }
    next(err);
};
website_bu_unbella.use(handleMulterError);

// เชื่อมต่อ MongoDB
connectDB();

// Route: หน้า Login (หน้าเริ่มต้น)
website_bu_unbella.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Website.html'));
});

// Route: หน้า Selection (เลือกตึก)
website_bu_unbella.get('/borrow-select', (req, res) => {
    res.sendFile(path.join(__dirname, 'borrow.html'));
});

// Route: หน้าฟอร์มยืมร่ม (Page A3)
website_bu_unbella.get('/pageA3', (req, res) => {
    res.sendFile(path.join(__dirname, 'pageA3.html'));
});

// Route: ฟอร์ม Building C6
website_bu_unbella.get('/pageC6', (req, res) => {
    res.sendFile(path.join(__dirname, 'pageC6.html'));
});

// Route: ฟอร์ม A6
website_bu_unbella.get('/pageA6', (req, res) => {
    res.sendFile(path.join(__dirname,'pageA6.html'));
});

// Route: หน้า Return (คืนร่ม)
website_bu_unbella.get('/return', (req, res) => {
    res.sendFile(path.join(__dirname, 'return.html'));
});

// Route: ตรวจสอบประวัติการยืม
website_bu_unbella.post('/api/check-borrow', async (req, res) => {
    const { studentId } = req.body;

    try {
        const borrowRecord = await BorrowData.findOne({ studentId, returned: false });
        if (borrowRecord) {
            return res.json({
                success: true,
                hasActiveBorrow: true,
                redirect: '/return'
            });
        } else {
            return res.json({
                success: true,
                hasActiveBorrow: false,
                redirect: '/borrow-select'
            });
        }
    } catch (err) {
        console.error('Check Borrow Error:', err);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการตรวจสอบประวัติการยืม'
        });
    }
});

// Route: ดึงข้อมูลการยืมสำหรับหน้า return.html
website_bu_unbella.get('/api/borrow-details/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
        const borrowRecord = await BorrowData.findOne({ studentId, returned: false });
        if (borrowRecord) {
            return res.json({
                success: true,
                data: borrowRecord
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบประวัติการยืมที่ยังไม่คืน'
            });
        }
    } catch (err) {
        console.error('Fetch Borrow Details Error:', err);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการยืม'
        });
    }
});

// Route: ยืนยันการคืนร่ม
website_bu_unbella.post('/api/return-umbrella', upload.single('umbrellaPhoto'), async (req, res) => {
    const { studentId, rating } = req.body;
    const photoPath = req.file ? req.file.path : '';

    try {
        const borrowRecord = await BorrowData.findOneAndDelete({ studentId, returned: false });
        if (borrowRecord) {
            // บันทึกประวัติการคืนใน ReturnData
            const returnRecord = new ReturnData({
                studentId,
                rating: parseInt(rating) || 0,
                photoPath,
                originalBorrowId: borrowRecord._id
            });
            await returnRecord.save();

            console.log('--- ลบข้อมูลการยืมและบันทึกการคืนสำเร็จ ---', borrowRecord._id);
            return res.json({
                success: true,
                message: 'คืนร่มสำเร็จ'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบประวัติการยืมที่ยังไม่คืน'
            });
        }
    } catch (err) {
        console.error('Return Umbrella Error:', err);
        if (req.file && fs.existsSync(photoPath)) {
            fs.unlinkSync(photoPath); // ลบไฟล์ถ้ามี error
        }
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการคืนร่ม'
        });
    }
});

// Route: บันทึกข้อมูลการยืม
website_bu_unbella.post('/borrow', async (req, res) => {
    const borrowData = req.body;

    try {
        const newBorrowEntry = await BorrowData.create({
            fullname: borrowData.fullname,
            studentId: borrowData.studentId,
            location: borrowData.location,
            duration: borrowData.duration,
            email: borrowData.email,
            mobile: borrowData.mobile,
            returned: false,
            rating: 0,
            photoPath: ''
        });

        console.log('--- บันทึกข้อมูลการยืมร่มสำเร็จลง MongoDB ---');
        console.log(newBorrowEntry);

        res.status(200).json({
            success: true,
            message: 'บันทึกการยืมร่มของท่านเรียบร้อยแล้ว'
        });
    } catch (error) {
        console.error('MongoDB Save Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลลงฐานข้อมูล'
        });
    }
});

website_bu_unbella.listen(5001, () => console.log('Server running on port 5001'));