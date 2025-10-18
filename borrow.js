
const swiper = new Swiper(".swiper", {
  // Optional parameters
  direction: "horizontal",
  loop: true,

  slidesPerView: 3,
  centeredSlides: true,


  // If we need pagination
  pagination: {
    el: ".swiper-pagination",

    dynamicBullets: true,
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  
});

swiper.on('slideNextTransitionStart', () => {
  updateMainBackground()
})

swiper.on('slidePrevTransitionStart', () => {
  updateMainBackground()
})

function updateMainBackground() {
  const activeSlide = document.querySelector('.swiper-slide-active')
  const mainContainer = document.querySelector('.main-slides')
  mainContainer.style.background = activeSlide.style.background
}

// เพิ่มส่วนนี้เพื่อให้คลิกแล้วไปหน้าใหม่ได้
const slides = document.querySelectorAll('.swiper-slide');

slides.forEach((slide) => {
  slide.style.cursor = 'pointer'; // ให้เห็นว่าคลิกได้

  slide.addEventListener('click', () => {
    if (!slide.classList.contains('swiper-slide-active')) { //คลิกได้เฉพาะสไลด์ที่เลือกอยู่
      return;
    }
    const title = slide.querySelector('.slide-title')?.textContent.trim();
    const desc = slide.querySelector('.slide-desc')?.textContent.trim();

    if (title === 'Building A3') {
      window.location.href = '/pageA3';
    } else if (title === 'Building' && desc === 'Cafeteria 1') {
      window.location.href = '/cafeteria1';
    } else if (title === 'Building' && desc === 'Cafeteria 2') {
      window.location.href = '/cafeteria2';
    } else if (title === 'Building C6') {
      window.location.href = '/pageC6';
    }
  });

});
