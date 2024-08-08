let currentSlideIndex = 0;
let editingIndex = null;

function addNews() {
    const title = document.getElementById('news-title').value;
    const description = document.getElementById('news-description').value;
    const imageInput = document.getElementById('news-image');
    const imageFile = imageInput.files[0];

    let imageUrl = '';

    if (title && description) {
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imageUrl = event.target.result;
                saveAndUpdateSlides(title, description, imageUrl);
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveAndUpdateSlides(title, description, imageUrl);
        }
    }
}

function saveAndUpdateSlides(title, description, imageUrl) {
    if (editingIndex !== null) {
        updateSlide(editingIndex, title, description, imageUrl);
    } else {
        createSlide(title, description, imageUrl);
        saveNews(title, description, imageUrl);
    }
    clearForm();
    clearEditForm();
    hideEditButton();
}

function createSlide(title, description, imageUrl) {
    const slides = document.getElementById('slides');
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.ondblclick = () => showEditPopup(slides.children.length - 1); // Handle double-click

    slide.innerHTML = `
        ${imageUrl ? `<img src="${imageUrl}" alt="News Image">` : '<div class="no-image">No Image</div>'}
        <h2>${title}</h2>
        <p>${description}</p>
        <button class="edit-button" onclick="showEditPopup(${slides.children.length - 1})">Edit</button>
    `;

    // Insert the new slide at the beginning
    slides.insertBefore(slide, slides.firstChild);
    createDots(); // Create dots whenever a new slide is added
    showSlide(0); // Show the newly created slide
}

function saveNews(title, description, imageUrl) {
    const newsData = JSON.parse(localStorage.getItem('newsData')) || [];
    newsData.unshift({ title, description, imageUrl }); // Add new news to the beginning
    localStorage.setItem('newsData', JSON.stringify(newsData));
}

function loadNews() {
    const newsData = JSON.parse(localStorage.getItem('newsData')) || [];
    const slides = document.getElementById('slides');
    
    slides.innerHTML = ''; // Clear existing slides

    // Load news in reverse order (latest first)
    newsData.forEach((news, index) => {
        createSlide(news.title, news.description, news.imageUrl);
    });

    if (newsData.length > 0) {
        showSlide(0); // Show the first slide if there are any
    }
}

function deleteCurrentNews() {
    const slides = document.getElementById('slides');
    if (slides.children.length > 0) {
        slides.removeChild(slides.children[currentSlideIndex]);

        let newsData = JSON.parse(localStorage.getItem('newsData')) || [];
        newsData.splice(currentSlideIndex, 1);
        localStorage.setItem('newsData', JSON.stringify(newsData));

        reloadSlides();
    }
}

function reloadSlides() {
    const slides = document.getElementById('slides');
    slides.innerHTML = '';
    loadNews();
    currentSlideIndex = 0;
}

function showSlide(index) {
    const slides = document.getElementById('slides');
    const totalSlides = slides.children.length;

    // Ensure index is within bounds
    currentSlideIndex = (index + totalSlides) % totalSlides;
    slides.style.transform = `translateX(${-currentSlideIndex * 100}%)`;

    updateDots(); // Update dots on slide change
}

function changeSlide(direction) {
    const slides = document.getElementById('slides');
    const totalSlides = slides.children.length;

    // Update index and show new slide
    currentSlideIndex = (currentSlideIndex + direction + totalSlides) % totalSlides;
    showSlide(currentSlideIndex);
}

function createDots() {
    const slides = document.getElementById('slides');
    const dotsContainer = document.querySelector('.dots-container');
    dotsContainer.innerHTML = ''; // Clear existing dots

    for (let i = 0; i < slides.children.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.addEventListener('click', () => showSlide(i));
        dotsContainer.appendChild(dot);
    }
    updateDots(); // Update dots after creation
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.className = index === currentSlideIndex ? 'dot active' : 'dot';
    });
}


    const slides = document.getElementById('slides');
    if (slides.children.length > 0) {
        const currentSlide = slides.children[index];

        document.getElementById('edit-news-title').value = currentSlide.querySelector('h2').textContent;
        document.getElementById('edit-news-description').value = currentSlide.querySelector('p').textContent;

        const image = currentSlide.querySelector('img');
        if (image) {
            document.getElementById('edit-news-image').setAttribute('data-existing-url', image.src);
        } else {
            document.getElementById('edit-news-image').removeAttribute('data-existing-url');
        }

        document.getElementById('edit-popup').style.display = 'block';
        editingIndex = index;
    }



function closeEditPopup() {
    document.getElementById('edit-popup').style.display = 'none';
}

function applyEdit() {
    const title = document.getElementById('edit-news-title').value;
    const description = document.getElementById('edit-news-description').value;
    const imageInput = document.getElementById('edit-news-image');
    const imageFile = imageInput.files[0];

    let imageUrl = imageInput.getAttribute('data-existing-url') || '';

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imageUrl = event.target.result;
            updateSlide(editingIndex, title, description, imageUrl);
            closeEditPopup();
        };
        reader.readAsDataURL(imageFile);
    } else {
        updateSlide(editingIndex, title, description, imageUrl);
        closeEditPopup();
    }
}

function updateSlide(index, title, description, imageUrl) {
    const slides = document.getElementById('slides');
    const slide = slides.children[index];
    slide.innerHTML = `
        ${imageUrl ? `<img src="${imageUrl}" alt="News Image">` : '<div class="no-image">No Image</div>'}
        <h2>${title}</h2>
        <p>${description}</p>
        <button class="edit-button" onclick="showEditPopup(${index})">Edit</button>
    `;

    let newsData = JSON.parse(localStorage.getItem('newsData')) || [];
    newsData[index] = { title, description, imageUrl };
    localStorage.setItem('newsData', JSON.stringify(newsData));
}

function clearForm() {
    document.getElementById('news-title').value = '';
    document.getElementById('news-description').value = '';
    document.getElementById('news-image').value = '';
}

function clearEditForm() {
    document.getElementById('edit-news-title').value = '';
    document.getElementById('edit-news-description').value = '';
    document.getElementById('edit-news-image').value = '';
}

window.onload = function() {
    loadNews();
    createDots();
};
