// Function to simulate getting the user's IP address (replace with actual implementation)
function getUserIP() {
    // Replace this with the actual implementation to get the user's IP address
    return '185.173.204.94'; // Example IP address (change as needed for testing)
}

// Check if the user is allowed to perform admin actions
function isAdmin(userIP) {
    const adminIP = '185.173.204.93';
    return userIP === adminIP;
}

document.addEventListener("DOMContentLoaded", function() {
    const userIP = getUserIP(); // Get the user's IP address

    // Admin check
    const isAdminUser = isAdmin(userIP);

    // Elements that need to be shown/hidden
    const newsForm = document.querySelector('.news-form');
    const deleteButton = document.querySelector('.delete-button');
    const editButtons = document.querySelectorAll('.edit-button');

    // Show or hide elements based on IP
    if (isAdminUser) {
        // User is admin, show all elements
        if (newsForm) newsForm.style.display = 'block';
        if (deleteButton) deleteButton.style.display = 'block';
        editButtons.forEach(button => button.style.display = 'inline-block'); // Show edit buttons
    } else {
        // User is not admin, hide admin functionalities
        if (newsForm) newsForm.style.display = 'none';
        if (deleteButton) deleteButton.style.display = 'none';
        editButtons.forEach(button => button.style.display = 'none'); // Hide edit buttons
    }
});

function showEditPopup(index) {
    if (!isAdmin(getUserIP())) return; // Restrict access if not admin

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
}

function closeEditPopup() {
    document.getElementById('edit-popup').style.display = 'none';
}

function applyEdit() {
    if (!isAdmin(getUserIP())) return; // Restrict access if not admin

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
        ${isAdmin(getUserIP()) ? `<button class="edit-button" onclick="showEditPopup(${index})">Edit</button>` : ''}
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
