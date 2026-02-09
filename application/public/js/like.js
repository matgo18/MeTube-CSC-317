document.addEventListener('DOMContentLoaded', () => {
    const likeButton = document.getElementById('like-button');
    const likeCount = document.getElementById('like-count');
    const videoId = likeButton.dataset.videoId;

    likeButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`/like/${videoId}`, { method: 'POST' });
            const result = await response.json();

            if (response.ok) {
                likeCount.textContent = result.likes;
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error(err);
        }
    });
});

