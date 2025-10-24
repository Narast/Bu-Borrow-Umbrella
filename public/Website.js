async function handleLogin() {
    const studentIdInput = document.getElementById('studentId');
    const studentId = studentIdInput.value.trim();

    
    let errorMessage = '';

    // 1. ตรวจสอบรหัสนักศึกษา / บุคลากร (10 หลัก)
    if (!/^\d{6}$/.test(studentId)) {
        errorMessage += 'รหัสนักศึกษา / บุคลากรไม่ถูกต้อง <br>';
    }

    // 3. จัดการข้อผิดพลาดในฝั่ง client
    if (errorMessage !== '') {
        Swal.fire({
            title: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง!',
            html: errorMessage,
            icon: 'error',
            confirmButtonText: 'ลองอีกครั้ง',
            confirmButtonColor: '#d33',
            allowOutsideClick: false,
            scrollbarPadding: false
        });
        
        studentIdInput.focus();
        return;
    }

    // 4. ตรวจสอบประวัติการยืม
    try {
        const borrowResponse = await fetch('/api/check-borrow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId }) // ส่งแค่ studentId
        });
        if (!borrowResponse.ok) {
            const errorText = await borrowResponse.text();
            throw new Error(errorText || 'Server error');
        }
        const borrowResult = await borrowResponse.json();

        if (!borrowResult.success) {
            Swal.fire({
                title: 'ข้อผิดพลาด',
                text: borrowResult.message,
                icon: 'error',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#d33',
                allowOutsideClick: false,
                scrollbarPadding: false
            });
            return;
        }

        // 5. เก็บ studentId ใน localStorage
        localStorage.setItem('studentId', studentId);

        // 6. แสดง Pop-up สำเร็จและ redirect
        Swal.fire({
            title: 'เข้าสู่ระบบสำเร็จ!',
            text: 'กำลังนำทางคุณไปยังหน้าถัดไป...',
            icon: 'success',
            showConfirmButton: false,
            allowOutsideClick: false,
            scrollbarPadding: false,
            timer: 1500
        }).then(() => {
            window.location.href = borrowResult.redirect; // ไปที่ /return หรือ /borrow-select
        });

    } catch (err) {
        console.error('Login Error:', err);
        Swal.fire({
            title: 'ข้อผิดพลาด',
            text: err.message || 'เกิดข้อผิดพลาดในการล็อกอิน กรุณาลองใหม่',
            icon: 'error',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#d33',
            allowOutsideClick: false,
            scrollbarPadding: false
        });
    }
    
}
// Animation: Raindrop Effect
function createRaindrop() {
    const raindrop = document.createElement("div");
    raindrop.className = "raindrop";

    const left = Math.random() * 100;
    const width = Math.random() * 2 + 1;
    const height = Math.random() * 50 + 70;
    const duration = Math.random() * 0.7 + 0.7;
    const delay = Math.random() * 1;

    raindrop.style.left = `${left}%`;
    raindrop.style.width = `${width}px`;
    raindrop.style.height = `${height}px`;
    raindrop.style.animationDuration = `${duration}s`;
    raindrop.style.animationDelay = `${delay}s`;

    return raindrop;
}

for (let i = 0; i < 50; i++) {
    document.body.appendChild(createRaindrop());
}

// Animation: Lightning Effect
window.addEventListener('DOMContentLoaded', () => {
    let canvas = document.getElementById('lightning');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'lightning';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        document.body.appendChild(canvas);
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
    }

    const ctx = canvas.getContext('2d');

    function drawLightning(xStart, yStart) {
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        let xPos = xStart;
        let yPos = yStart;
        Array.from({ length: 10 }, () => {
            xPos += (Math.random() - 0.5) * 100;
            yPos += Math.random() * 60 + 20;
            ctx.lineTo(xPos, yPos);
        });
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function lightningEffect() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        const startX = Math.random() * canvas.width;
        drawLightning(startX, 0);
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setTimeout(() => {
                requestAnimationFrame(lightningEffect);
            }, Math.random() * 1000 + 3000);
        }, 200);
    }

    lightningEffect();
});