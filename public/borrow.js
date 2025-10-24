const swiper = new Swiper(".swiper", {
  direction: "horizontal",
  loop: true,
  slidesPerView: 3,
  centeredSlides: true,
  initialSlide: 0,
  speed: 600,
  grabCursor: true,

  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: true,
    clickable: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    0: { slidesPerView: 1},
    768: { slidesPerView: 2},
    1024: { slidesPerView: 3 },
  },
});

// ✅ อัปเดตพื้นหลังหลักให้สมูทขึ้น
swiper.on('slideChangeTransitionStart', updateMainBackground);

function updateMainBackground() {
  const activeSlide = document.querySelector('.swiper-slide-active');
  const mainContainer = document.querySelector('.main-slides');
  if (activeSlide && mainContainer) {
    mainContainer.style.backgroundImage = activeSlide.style.backgroundImage;
  }
}

// ✅ เพิ่มการคลิกเพื่อเปลี่ยนหน้าเฉพาะสไลด์ที่ active
document.querySelectorAll('.swiper-slide').forEach((slide) => {
  slide.style.cursor = 'pointer';
  slide.addEventListener('click', () => {
    if (!slide.classList.contains('swiper-slide-active')) return;

    const title = slide.querySelector('.slide-title')?.textContent.trim();
    if (title === 'Building A3') {
      window.location.href = '/pageA3';
    } else if (title === 'Building A6') {
      window.location.href = '/pageA6';
    } else if (title === 'Building C6') {
      window.location.href = '/pageC6';
    }
  });
});