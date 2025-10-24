function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidMobile(mobile) {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
}

async function confirmBorrowing() {
    // 1. ดึงค่าจากฟอร์ม
    const fullname = document.getElementById('fullname').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const location = document.getElementById('location').value; 
    const duration = document.getElementById('duration').value; 
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();

    let errorMessage = '';

    // 2. ตรวจสอบความถูกต้อง (Validation)
    if (fullname === '') { errorMessage += '❌ กรุณากรอกชื่อ-นามสกุล\n'; }
    if (!/^\d{10}$/.test(studentId)) { errorMessage += '❌ กรุณากรอกรหัสนักศึกษา (ตัวเลข 10 หลัก)\n'; }
    if (duration === "" || duration.includes('---')) { errorMessage += '❌ กรุณาเลือกเวลาที่ต้องการยืม\n'; }
    if (email === "") { errorMessage += '❌ กรุณากรอก Email\n'; } 
    else if (!isValidEmail(email)) { errorMessage += '❌ รูปแบบ Email ไม่ถูกต้อง\n'; }
    if (mobile === "") { errorMessage += '❌ กรุณากรอกเบอร์โทรศัพท์\n'; } 
    else if (!isValidMobile(mobile)) { errorMessage += '❌ รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 10 หลัก)\n'; }

    // 3. ถ้ามีข้อผิดพลาด: แสดง SweetAlert2 ข้อผิดพลาด
    if (errorMessage !== '') {
        Swal.fire({
            title: 'ข้อผิดพลาด!',
            html: `<pre style="text-align: left;">${errorMessage}</pre>`,
            icon: 'error',
            confirmButtonText: 'แก้ไข',
        });
        return; 
    }

    // 4. ถ้าข้อมูลถูกต้อง: เตรียมข้อมูลและส่งไป Server
    const formData = {
        fullname: fullname,
        studentId: studentId,
        location: location,
        duration: duration,
        email: email,
        mobile: mobile
    };

    try {
        const response = await fetch('/borrow', { // <--- ส่งไปที่ POST /borrow
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData) 
        });

        const result = await response.json(); 

        if (response.ok && result.success) { 
            // 5.1 สำเร็จ และเปลี่ยนไปหน้า return.html
            Swal.fire({
                title: 'สำเร็จ!',
                text: result.message,
                icon: 'success',
                confirmButtonText: 'ไปหน้าการคืน',
            }).then((res) => {
                if (res.isConfirmed) {
                    document.getElementById('borrowForm').reset(); 
                    window.location.href = 'return.html';
                }
            });
        } else {
            // 5.2 Server มีปัญหา
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: result.message || 'Server พบข้อผิดพลาดในการบันทึก',
                icon: 'error',
                confirmButtonText: 'ตกลง',
            });
        }
    } catch (error) {
        // 5.3 ข้อผิดพลาดเครือข่าย
        console.error('Error sending data:', error);
        Swal.fire({
            title: 'ข้อผิดพลาดเครือข่าย!',
            text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ ลองใหม่อีกครั้ง',
            icon: 'error',
            confirmButtonText: 'ตกลง',
        });
    }
}

function cancelBorrowing() {
    Swal.fire({
        title: 'ยืนยันการยกเลิก',
        text: 'คุณต้องการยกเลิกการทำรายการและล้างข้อมูลในฟอร์มใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#556066',
        confirmButtonText: 'ใช่, ยกเลิก',
        cancelButtonText: 'ไม่, ทำต่อ'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('borrowForm').reset(); 
            Swal.fire( 'ยกเลิกสำเร็จ!', 'ข้อมูลในฟอร์มได้ถูกล้างแล้ว', 'info' );
        }
    });
}