
function handleLogin() {
    const studentIdInput = document.getElementById('studentId');
    const passwordInput = document.getElementById('password'); // ดึง input password
    
    const studentId = studentIdInput.value.trim();
    const password = passwordInput.value; // ดึงค่า password
    
    let errorMessage = '';

    // 1. ตรวจสอบรหัสนักศึกษา (10 หลัก)
    if (!/^\d{10}$/.test(studentId)) {
        errorMessage += 'รหัสนักศึกษาไม่ถูกต้อง<br>';
    }

    // 2. ตรวจสอบรหัสผ่าน (ขั้นต่ำ 6 ตัว)
    if (password.length < 6) {
        errorMessage += 'รหัสผ่านไม่ถูกต้อง<br>';
    }

    // 3. จัดการข้อผิดพลาด (แสดง SweetAlert2)
    if (errorMessage !== '') {
        // หากมีข้อผิดพลาด: แสดงแจ้งเตือน ERROR อันใหญ่
        Swal.fire({
            title: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง!',
            html: errorMessage, // แสดงข้อผิดพลาดทั้งหมดที่รวบรวมไว้
            icon: 'error',
            confirmButtonText: 'ลองอีกครั้ง',
            confirmButtonColor: '#d33', 
            allowOutsideClick: false, 
            scrollbarPadding: false, // แก้ปัญหาหน้าขยับ
        });
        
        // กำหนด focus ไปที่ช่องที่มีปัญหา (ถ้า Student ID ผิด ให้ focus ID, ถ้า ID ถูกแต่ PWD ผิด ให้ focus PWD)
        if (!/^\d{10}$/.test(studentId)) {
            studentIdInput.focus();
        } else {
            passwordInput.focus();
        }
        
        return; // หยุดการทำงานถ้ามีข้อผิดพลาด
    }

    // 4. ถ้าผ่านการตรวจสอบทั้งหมด: แสดงแจ้งเตือนสำเร็จ
    
    // แสดง Pop-up สำเร็จอันใหญ่ตรงกลาง
    Swal.fire({
        title: 'เข้าสู่ระบบสำเร็จ!',
        text: 'กำลังนำทางคุณไปยังหน้ายืมร่ม...',
        icon: 'success',
        showConfirmButton: false, 
        allowOutsideClick: false,
        scrollbarPadding: false, // แก้ปัญหาหน้าขยับ
    });
    
    // *สำคัญ*: เปลี่ยนหน้าทันทีหลังจาก Pop-up แสดง 1.5 วินาที
    setTimeout(() => {
        window.location.href = 'borrow.html';
    }, 1500); 
}
// ------------------------------------------------------------------------------------------------

function createRaindrop() {
    const raindrop = document.createElement("div");
    raindrop.className = "raindrop";

    const left = Math.random() * 100; // เริ่มที่ 0% ถึง 100%
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

for(let i=0; i<50; i++) {
    document.body.appendChild(createRaindrop());
}

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
        // แสดงสายฟ้า 0.2 วิ แล้วลบออก
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // รออีก 3-4 วิ ก่อนผ่าครั้งใหม่
            setTimeout(() => {
                requestAnimationFrame(lightningEffect);
            }, Math.random() * 1000 + 3000); // 3000-4000 ms
        }, 200); // สายฟ้าแสดง 0.2 วิ
    }

    lightningEffect();
});

