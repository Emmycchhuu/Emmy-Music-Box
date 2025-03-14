async function searchMusic() {
    let query = document.getElementById('searchInput').value;
    if (!query) {
        alert('Please enter a song or artist name.');
        return;
    }

    let resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = "<p>Searching...</p>";

    try {
        let musicBrainzResults = await fetchMusicBrainz(query);
        let freesoundResults = await fetchFreesound(query);
        let youtubeResults = await fetchYouTubeMusic(query);

        resultsContainer.innerHTML = musicBrainzResults + freesoundResults + youtubeResults;
    } catch (error) {
        resultsContainer.innerHTML = `<p>Error fetching results. Try again later.</p>`;
    }
}

// Fetch MusicBrainz (Free Music Metadata)
async function fetchMusicBrainz(query) {
    let response = await fetch(`https://musicbrainz.org/ws/2/artist/?query=${query}&fmt=json`);
    let data = await response.json();
    
    let results = "<h3>MusicBrainz Results:</h3>";
    data.artists.slice(0, 5).forEach(artist => {
        results += `
            <div class="result-item">
                <p><strong>${artist.name}</strong></p>
                <p>Type: ${artist.type || "Unknown"}</p>
            </div>
        `;
    });
    return results;
}

// Fetch Freesound (Free Audio Samples)
async function fetchFreesound(query) {
    const API_KEY = 'YOUR_FREESOUND_API_KEY'; // Replace with a free API key from Freesound.org
    let response = await fetch(`https://freesound.org/apiv2/search/text/?query=${query}&token=${API_KEY}`);
    let data = await response.json();

    let results = "<h3>Freesound Results:</h3>";
    data.results.slice(0, 5).forEach(sound => {
        results += `
            <div class="result-item">
                <p><strong>${sound.name}</strong></p>
                <audio controls>
                    <source src="${sound.previews['preview-hq-mp3']}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                <a href="${sound.url}" target="_blank" class="btn btn-success">View</a>
            </div>
        `;
    });
    return results;
}

// Fetch YouTube Music Results & Add Y2Mate Downloader
async function fetchYouTubeMusic(query) {
    let response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=AIzaSyC5wF7X-1fKkRlGxlT6lUwWJaVvVq5aeZU`);
    let data = await response.json();
    
    let results = "<h3>YouTube Music Results:</h3>";
    data.items.forEach(item => {
        let videoId = item.id.videoId;
        let downloadLink = `https://www.y2mate.com/youtube/${videoId}`;
        
        results += `
            <div class="result-item">
                <p><strong>${item.snippet.title}</strong></p>
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="btn btn-success">Listen</a>
                <a href="${downloadLink}" target="_blank" class="btn btn-danger">Download</a>
            </div>
        `;
    });
    return results;
}
