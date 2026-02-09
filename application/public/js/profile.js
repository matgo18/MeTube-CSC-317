const gallery = document.getElementById('user-video-gallery');
const countDisplay = document.getElementById('user-video-count');

function updateVideoCount() {
    const count = gallery.children.length;
    countDisplay.textContent = `Your videos: ${count}`;
}

function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'photo-card';

    const img = document.createElement('img');
    img.src = video.thumbnail_path;
    img.className = 'photo-img';

    const title = document.createElement('div');
    title.textContent = `Title: ${video.title}`;
    title.className = 'photo-title';
    title.style = 'font-size: 20px';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.type = 'submit';

    deleteButton.addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent redirect
        const confirmed = confirm(`Are you sure you want to delete "${video.title}"?`);
        if (confirmed) {
            try {
                const response = await fetch(`/api/videos/${video.id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    card.remove(); // Remove the card from DOM
                } else {
                    alert('Failed to delete video.');
                }
            } catch (err) {
                console.error('Error deleting video:', err);
                alert('An error occurred while deleting the video.');
            }
        }
        updateVideoCount();
    });

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(deleteButton);

    card.addEventListener('click', () => {
        window.location.href = `/viewpost/${video.id}`;
    });

    return card;
}

async function loadUserVideos() {
    try {
        const res = await fetch('/api/user-videos');
        const videos = await res.json();

        gallery.innerHTML = '';

        if (videos.length === 0) {
            countDisplay.textContent = 'Number of videos: 0';
            return;
        }

        videos.forEach(video => {
            const card = createVideoCard(video);
            gallery.appendChild(card);
        });

        updateVideoCount();
    } catch (error) {
        countDisplay.textContent = 'Failed to load your videos.';
        console.error(error);
    }
}

window.addEventListener('DOMContentLoaded', loadUserVideos);
