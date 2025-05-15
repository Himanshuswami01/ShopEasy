document.addEventListener('DOMContentLoaded', function() {
    const sliderImages = [
        'images/slider/slide1.jpg',
        'images/slider/slide2.jpg',
        'images/slider/slide3.jpg'
    ];
    
    let currentSlide = 0;
    const sliderContainer = document.querySelector('.slider-container');
    
    function createSlider() {
        sliderImages.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = image;
            img.style.display = index === 0 ? 'block' : 'none';
            sliderContainer.appendChild(img);
        });
    }
    
    function nextSlide() {
        const images = sliderContainer.querySelectorAll('img');
        images[currentSlide].style.display = 'none';
        currentSlide = (currentSlide + 1) % images.length;
        images[currentSlide].style.display = 'block';
    }
    
    createSlider();
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
}); 