// โหลดข้อมูลการยืมเมื่อหน้าโหลด
async function loadBorrowDetails() {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
        Swal.fire({
            title: 'ข้อผิดพลาด',
            text: 'กรุณาล็อกอินก่อน',
            icon: 'error',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#d33'
        }).then(() => {
            window.location.href = '/';
        });
        return;
    }

    try {
        const response = await fetch(`/api/borrow-details/${studentId}`);
        const result = await response.json();

        if (!result.success) {
            Swal.fire({
                title: 'ข้อผิดพลาด',
                text: result.message,
                icon: 'error',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#d33'
            }).then(() => {
                window.location.href = '/borrow-select';
            });
            return;
        }

        const data = result.data;
        document.getElementById('fullname').value = data.fullname;
        document.getElementById('studentId').value = data.studentId;
        document.getElementById('location').value = data.location;
        document.getElementById('email').value = data.email;
        document.getElementById('mobile').value = data.mobile;
    } catch (err) {
        console.error('Error:', err);
        Swal.fire({
            title: 'ข้อผิดพลาด',
            text: 'เกิดข้อผิดพลาดในการดึงข้อมูลการยืม',
            icon: 'error',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#d33'
        });
    }
}

// จัดการ rating
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
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    };

    // การคลิก (กำหนดค่า)
    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            currentRating = parseInt(e.target.getAttribute('data-value'));
            ratingInput.value = currentRating;
            highlightStars(currentRating);
        });
    });

    // การวางเมาส์ (แสดงตัวอย่าง)
    ratingContainer.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('star')) {
            const hoverRating = parseInt(e.target.getAttribute('data-value'));
            highlightStars(hoverRating);
        }
    });

    // การเอาเมาส์ออก (กลับไปค่าเดิม)
    ratingContainer.addEventListener('mouseout', () => {
        highlightStars(currentRating);
    });
});

// ยืนยันการคืน
async function confirmReturn() {
    const studentId = localStorage.getItem('studentId');
    const location = document.getElementById('location').value;
    const rating = document.getElementById('ratingValue').value;
    const photoFile = document.getElementById('umbrellaPhoto').files[0];

    // ตรวจสอบเงื่อนไข
    let errorMessage = '';

    if (location === "") {
        errorMessage += '❌ สถานที่คืนไม่ถูกต้อง\n';
    }

    if (parseInt(rating) === 0) {
        errorMessage += '❌ กรุณาให้คะแนนความพึงพอใจ\n';
    }

    if (!photoFile) {
        errorMessage += '❌ กรุณาอัพโหลดรูปภาพการคืนร่ม\n';
    }

    if (errorMessage !== '') {
        Swal.fire({
            title: 'ข้อผิดพลาด!',
            html: `<pre style="text-align: left; white-space: pre-wrap;">${errorMessage}</pre>`,
            icon: 'error',
            confirmButtonText: 'แก้ไข',
            confirmButtonColor: '#d33'
        });
        return;
    }

    // แสดงหน้าต่างยืนยัน
    Swal.fire({
        title: 'ยืนยันการคืนร่ม?',
        html: `
            <b>สถานที่:</b> ${location}<br>
            <b>คะแนน:</b> ${rating} ดาว<br>
            <b>รูปภาพ:</b> ${photoFile.name}
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ใช่, ยืนยัน',
        cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
        if (result.isConfirmed) {
            // ส่งข้อมูลไปยัง backend
            const formData = new FormData();
            formData.append('studentId', studentId);
            formData.append('rating', rating);
            formData.append('umbrellaPhoto', photoFile);

            try {
                const response = await fetch('/api/return-umbrella', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.success) {
                    Swal.fire({
                        title: 'คืนร่มสำเร็จ!',
                        text: 'ขอบคุณสำหรับการคืนร่ม',
                        icon: 'success',
                        confirmButtonText: 'รับทราบ',
                        timer: 1500
                    }).then(() => {
                        // รีเซ็ตฟอร์มและดาว
                        document.getElementById('returnForm').reset();
                        document.getElementById('ratingValue').value = 0;
                        document.querySelectorAll('.star').forEach(star => {
                            star.classList.remove('fas');
                            star.classList.add('far');
                        });
                        window.location.href = '/borrow-select';
                    });
                } else {
                    Swal.fire({
                        title: 'ข้อผิดพลาด',
                        text: result.message,
                        icon: 'error',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#d33'
                    });
                }
            } catch (err) {
                console.error('Error:', err);
                Swal.fire({
                    title: 'ข้อผิดพลาด',
                    text: 'เกิดข้อผิดพลาดในการคืนร่ม',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#d33'
                });
            }
        }
    });
}

window.onload = loadBorrowDetails;