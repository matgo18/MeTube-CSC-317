const gallery = document.getElementById('photo-gallery');
const countDisplay = document.getElementById('photo-count');
const searchBar = document.getElementById('search-bar');
let debounceTimer;

searchBar.addEventListener('input', () => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        const searchTerm = searchBar.value.trim();
        loadPhotos(searchTerm);
    }, 300); // Wait 300ms after user stops typing
});

function updatePhotoCount() {
    const count = gallery.children.length;
    countDisplay.textContent = `Number of videos: ${count}`;
}

function createPhotoCard(photo) {
    const card = document.createElement('div');
    card.className = 'photo-card';

    const img = document.createElement('img');
    img.src = photo.thumbnail_path;
    img.className = 'photo-img';

    const title = document.createElement('div');
    title.textContent = `Title: ${photo.title}`;
    title.className = 'photo-title';
    title.style = 'font-size: 20px';

    const author = document.createElement('div');
    author.textContent = `Author: ${photo.author}`;
    author.className = 'photo-author';

    card.appendChild(img);
    card.appendChild(title);
    title.appendChild(author);

    card.addEventListener('click', () => {
        window.location.href = `/viewpost/${photo.id}`;  // Redirect to the specific video page
    });

    return card;
}

document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    const query = document.getElementById('search-bar').value.trim();
    loadPhotos(query);
});

async function loadPhotos(search = '') {
    try {
        const res = await fetch(`/api/videos?search=${search}`);
        const photos = await res.json();

        gallery.innerHTML = ''; // Clear previous results

        if (photos.length === 0) {
            countDisplay.textContent = 'Number of videos: 0';
            return;
        }

        photos.forEach(photo => {
            const card = createPhotoCard(photo);
            gallery.appendChild(card);
        });

        updatePhotoCount();
    } catch (error) {
        countDisplay.textContent = 'Failed to load videos.';
        console.error('Error fetching videos:', error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadPhotos();
});