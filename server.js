const express = require('express');
const path = require('path');



const connectDB = require('./Config/db');
connectDB()

// 1. นำเข้า Mongoose Model
const BorrowData = require('./Models/borrowData');

const website_bu_unbella = express();

website_bu_unbella.use(express.json());
website_bu_unbella.use(express.static(__dirname)); // ให้บริการไฟล์ทั้งหมดจาก root folder

// 1. Route: หน้า Login (หน้าเริ่มต้น)
website_bu_unbella.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Website.html')); // แสดงหน้า Login
});

// 2. Route: หน้า Selection (หลัง Login สำเร็จ)
website_bu_unbella.get('/borrow-select', (req, res) => {
    res.sendFile(path.join(__dirname, 'borrow.html')); // แสดงหน้าเลือกตึก
});

// 3. Route: หน้าฟอร์มยืมร่ม (Page A3)
website_bu_unbella.get('/pageA3', (req, res) => {
    res.sendFile(path.join(__dirname, 'pageA3.html')); // แสดงหน้าฟอร์ม
});

// 4. Route: ฟอร์ม Building C6
website_bu_unbella.get('/pageC6', (req, res) => {
    res.sendFile(path.join(__dirname, 'pageC6.html'));
});

// 5. Route: ฟอร์ม Cafeteria 1
website_bu_unbella.get('/cafeteria1', (req, res) => {
    res.sendFile(path.join(__dirname, 'pageCafeteria1.html'));
});

// 6. Route: ฟอร์ม Cafeteria 2
website_bu_unbella.get('/cafeteria2', (req, res) => {
    res.sendFile(path.join(__dirname, 'pageCafeteria2.html'));
});


// 2. เปลี่ยน Route ให้เป็น async function เพื่อใช้ await
website_bu_unbella.post('/borrow', async (req, res) => { 
    const borrowData = req.body;

    try {
        // 3. สร้าง Instance ใหม่จาก Model และบันทึก
        const newBorrowEntry = await BorrowData.create({
            fullname: borrowData.fullname,
            studentId: borrowData.studentId,
            location: borrowData.location,
            duration: borrowData.duration,
            email: borrowData.email,
            mobile: borrowData.mobile
        });

        console.log('--- บันทึกข้อมูลการยืมร่มสำเร็จลง MongoDB ---');
        console.log(newBorrowEntry);
        
        // 4. ตอบกลับ Client ว่าสำเร็จ
        res.status(200).json({ 
            success: true, 
            message: 'บันทึกการยืมร่มของท่านเรียบร้อยแล้ว'
        });

    } catch (error) {
        console.error('MongoDB Save Error:', error);
        // 5. ตอบกลับ Client ว่ามีปัญหาในการบันทึก
        res.status(500).json({ 
            success: false, 
            message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลลงฐานข้อมูล'
        });
    }
});


website_bu_unbella.listen(5001, () => console.log('Server running on port 5001'))