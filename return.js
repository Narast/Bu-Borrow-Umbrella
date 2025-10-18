// โค้ดสำหรับจัดการการให้คะแนนดาว
document.addEventListener('DOMContentLoaded', () => {
    const ratingContainer = document.getElementById('returnRating');
    const stars = ratingContainer.querySelectorAll('.star');
    const ratingInput = document.getElementById('ratingValue');
    let currentRating = 0;

    // ฟังก์ชันสำหรับไฮไลท์ดาว
    const highlightStars = (rating) => {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            if (starValue <= rating) {
                star.classList.remove('far'); // far = ดาวขอบ
                star.classList.add('fas');  // fas = ดาวทึบ (เต็ม)
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    };

    // 1. การคลิก (กำหนดค่า)
    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            currentRating = parseInt(e.target.getAttribute('data-value'));
            ratingInput.value = currentRating; // เก็บค่าใน input
            highlightStars(currentRating); // ไฮไลท์ตามค่าที่เลือก
        });
    });

    // 2. การวางเมาส์ (แสดงตัวอย่าง)
    ratingContainer.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('star')) {
            const hoverRating = parseInt(e.target.getAttribute('data-value'));
            highlightStars(hoverRating);
        }
    });

    // 3. การเอาเมาส์ออก (กลับไปค่าเดิม)
    ratingContainer.addEventListener('mouseout', () => {
        highlightStars(currentRating);
    });

});


// ฟังก์ชันเสริม: ตรวจสอบรูปแบบอีเมลเบื้องต้น
function isValidEmail(email) {
    // Regular Expression สำหรับตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ฟังก์ชันเสริม: ตรวจสอบรูปแบบเบอร์โทรศัพท์ (สมมติเป็นเบอร์ไทย 10 หลัก)
function isValidMobile(mobile) {
    // Regular Expression สำหรับตรวจสอบตัวเลข 10 หลัก
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
}


// ฟังก์ชันนี้จะถูกเรียกเมื่อผู้ใช้คลิกปุ่ม "ยืนยันการคืน"
function confirmReturn() {
    
    // 1. ดึงค่าจาก Input
    const location = document.getElementById('location').value;
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const rating = document.getElementById('ratingValue').value; // ค่าคะแนนดาว
    const photoFile = document.getElementById('umbrellaPhoto').files[0]; // ไฟล์รูปภาพ

    // ตัวแปรสำหรับเก็บข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด
    let errorMessage = '';

    // 2. ตรวจสอบเงื่อนไขการคืนร่ม
    
    // ตรวจสอบสถานที่คืน
    if (location === "" || location === "--- เลือกสถานที่ ---" || location === "-- เลือกสถานที่ --") { 
        errorMessage += '❌ กรุณาเลือกสถานที่คืน\n';
    }

    // ตรวจสอบ Email
    if (email === "") {
        errorMessage += '❌ กรุณากรอก Email\n';
    } else if (!isValidEmail(email)) { // ตรวจสอบรูปแบบอีเมลเบื้องต้น
        errorMessage += '❌ รูปแบบ Email ไม่ถูกต้อง\n';
    }

    // ตรวจสอบเบอร์โทรศัพท์
    if (mobile === "") {
        errorMessage += '❌ กรุณากรอกเบอร์โทรศัพท์\n';
    } else if (!isValidMobile(mobile)) { // ตรวจสอบรูปแบบเบอร์โทรศัพท์เบื้องต้น
        errorMessage += '❌ รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 10 หลัก)\n';
    }

    // ตรวจสอบคะแนน
    if (parseInt(rating) === 0) { 
        errorMessage += '❌ กรุณาให้คะแนนความพึงพอใจ\n';
    }

    // ตรวจสอบรูปภาพ
    if (!photoFile) {
        errorMessage += '❌ กรุณาอัพโหลดรูปภาพการคืนร่ม\n';
    }


    if (errorMessage !== '') {
        // หากมีข้อผิดพลาด: แสดง SweetAlert2 แจ้งเตือนข้อผิดพลาด
        Swal.fire({
            title: 'ข้อผิดพลาด!',
            html: `<pre style="text-align: left; white-space: pre-wrap;">${errorMessage}</pre>`, // ใช้ pre-wrap เพื่อให้ข้อความยาวไม่ทะลุ
            icon: 'error',
            confirmButtonText: 'แก้ไข',
        });
        return; // หยุดการทำงานของฟังก์ชัน
    }

    // 3. แสดงหน้าต่างยืนยันการคืนร่ม
    Swal.fire({
        title: 'ยืนยันการคืนร่ม?',
        html: `
            <b>สถานที่:</b> ${location}<br>
            <b>Email:</b> ${email}<br>
            <b>เบอร์โทร:</b> ${mobile}<br>
            <b>คะแนน:</b> ${rating} ดาว<br>
            <b>รูปภาพ:</b> ${photoFile.name}
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ใช่, ยืนยัน',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            // ** ส่วนนี้คือจุดที่คุณจะทำการส่งข้อมูลไปยัง Server/API **

            Swal.fire({
                title: 'คืนร่มสำเร็จ!',
                text: 'ขอบคุณสำหรับการคืนร่ม',
                icon: 'success',
                confirmButtonText: 'รับทราบ',
            });

            //  รีเซ็ตแบบฟอร์มและการแสดงผลดาว
            const form = document.getElementById('returnForm');
            if (form) {
                form.reset(); 
                // รีเซ็ตดาว
                document.getElementById('ratingValue').value = 0;
                document.querySelectorAll('.star').forEach(star => {
                    star.classList.remove('fas');
                    star.classList.add('far');
                });
            }
        }
    });
}